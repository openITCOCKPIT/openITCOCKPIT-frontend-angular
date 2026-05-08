import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PushNotificationsService } from '../../services/push-notifications.service';
import {
    WebsocketMessage,
    WebsocketMessageType,
    WebSocketPushNotificationPayload,
    WebSocketsService
} from '../../services/web-sockets.service';

@Component({
    selector: 'oitc-push-notifications',
    imports: [],
    templateUrl: './push-notifications.component.html',
    styleUrl: './push-notifications.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PushNotificationsComponent implements OnInit, OnDestroy {

    private readonly PushNotificationsService: PushNotificationsService = inject(PushNotificationsService);
    private readonly WebSocketsService: WebSocketsService = inject(WebSocketsService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    private alreadySubscribed: boolean = false;

    constructor() {
        // The permissions check will check the browsers push notification permissions
        // Not any "openITCOCKPIT user specific" permissions.
        this.subscriptions.add(this.PushNotificationsService.hasPermissionObservable$.subscribe((hasPermission: boolean) => {
            this.onHasPermissionChange();
        }));
    }

    public ngOnInit(): void {
        if (this.PushNotificationsService.checkBrowserSupport()) {
            this.PushNotificationsService.checkPermissions();
        }
        this.WebSocketsService.acquire();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.WebSocketsService.release();
    }

    private connectToNotificationPushServer() {
        // Tell the WebSocket service to connect (in case not already done by another component)
        this.WebSocketsService.connect();

        // Subscribe to all messages received by the WebSocket client
        // But only process the relevant once.
        if (!this.alreadySubscribed) {
            this.subscriptions.add(
                this.WebSocketsService.messages$.subscribe({
                    next: (msg) => {
                        if (msg.type === WebsocketMessageType.ProcessPushNotification) {
                            this.gotMessage(msg);
                        }
                    }
                })
            );

            this.subscriptions.add(
                this.WebSocketsService.isConnected$.subscribe({
                    next: (isConnected: boolean) => {
                        if (isConnected) {
                            // Once we are connected to the WebSocket backend, we can tell the servicer
                            // that we want to consume Push Notifications
                            this.WebSocketsService.send({
                                type: WebsocketMessageType.RegisterBrowserPushNotification,
                                message: '',
                                payload: {
                                    // Additional data we could send to the server
                                    // If payload is an object, the WebSocketsService will automatically
                                    // add the clientUuid and browserUuid for us
                                    // so make sure we always have at least an empty object as playload!
                                }
                            });
                        }
                    }
                })
            );

            // In case we want, we could monitor connection errors here.
            // The WebSocket service will monitor for connection losses and reconnect automatically so for now we dont
            // need to do anything in here.
            //this.subscriptions.add(
            //    this.WebSocketsService.connectionError$.subscribe(isError => {
            //        const errorMessage = isError ? 'Connection lost. Reconnecting...' : null;
            //        console.log(errorMessage);
            //        console.log(isError);
            //    })
            //);

            // In case connectToNotificationPushServer() gets called multiple times, we would end up with multiple push messages
            this.alreadySubscribed = true;
        }
    };

    private onHasPermissionChange() {
        if (this.PushNotificationsService.hasPermission()) {
            this.connectToNotificationPushServer();
        }
    };

    private gotMessage = (msg: WebsocketMessage) => {
        if (msg.payload !== undefined) {
            const payload = msg.payload as WebSocketPushNotificationPayload;

            let options: NotificationOptions = {
                body: msg.message
            };

            if (payload.icon) {
                options.icon = payload.icon;
            }

            let notification = new Notification(payload.title, options);
            if (payload.hostUuid || payload.serviceUuid) {
                let url = '/hosts/browser/' + payload.hostUuid;
                if (payload.type === 'service') {
                    url = '/services/browser/' + payload.serviceUuid;
                }

                notification.onclick = function (event) {
                    event.preventDefault(); // prevent the browser from focusing the Notification's tab
                    window.open(url, '_blank');
                }
            }
        }
    }

}
