import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PushConfigurationRoot } from './push-notifications.interface';
import { PushNotificationsComponentService } from './push-notifications-component.service';
import { PushNotificationsService } from '../../services/push-notifications.service';

@Component({
    selector: 'oitc-push-notifications',
    imports: [],
    templateUrl: './push-notifications.component.html',
    styleUrl: './push-notifications.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PushNotificationsComponent implements OnInit, OnDestroy {

    private readonly PushNotificationsComponentService: PushNotificationsComponentService = inject(PushNotificationsComponentService);
    private readonly PushNotificationsService: PushNotificationsService = inject(PushNotificationsService);
    private subscriptions: Subscription = new Subscription();

    private userId: number | null = null;

    private Notification: Notification | null = null;

    private hasPermission: boolean = false;

    private websocketConfig: { [p: string]: string };

    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        if (this.checkBrowserSupport()) {
            this.checkPermissions();
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private checkBrowserSupport() {
        if (!("Notification" in window)) {
            console.warn('Browser does not support Notifications');
            return false;
        }
        return true;
    };

    private checkPermissions() {
        if (Notification.permission === "granted") {
            this.hasPermission = true;
            this.onHasPermissionChange();
            return true;
        }

        if (Notification.permission !== 'denied') {
            Notification.requestPermission((permission) => {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    this.hasPermission = true;
                    this.onHasPermissionChange();
                }
            });
        }

    };

    private connectToNotificationPushServer() {
        this.subscriptions.add(this.PushNotificationsComponentService.getPushConfiguration()
            .subscribe((result: PushConfigurationRoot) => {
                this.cdr.markForCheck();
                this.userId = result.user.id;

                this.websocketConfig = result.websocket;

                //Only connect, if the user has >= 1 contacts using browser push notifications
                if (result.user.hasPushContact) {
                    this.PushNotificationsService.setUrl(this.websocketConfig['PUSH_NOTIFICATIONS.URL']);
                    this.PushNotificationsService.setApiKey(this.websocketConfig['SUDO_SERVER.API_KEY']);

                    this.PushNotificationsService.setUserId(this.userId);
                    this.PushNotificationsService.onResponse(this.gotMessage);

                    this.PushNotificationsService.connect();
                }

            }));
    };

    private onHasPermissionChange() {
        if (this.hasPermission === true) {
            this.connectToNotificationPushServer();
        }
    };

    private gotMessage = (event: MessageEvent) => {
        if (typeof event.data !== "undefined") {
            let data = JSON.parse(event.data);

            let options = {
                body: data.message
            };

            if (data.data.icon !== null) {
                options['icon'] = data.data.icon;
            }

            let notification = new Notification(data.data.title, options);

            let url = '/hosts/browser/' + data.data.hostUuid;
            if (data.data.type === 'service') {
                url = '/services/browser/' + data.data.serviceUuid;
            }

            notification.onclick = function (event) {
                event.preventDefault(); // prevent the browser from focusing the Notification's tab
                window.open(url, '_blank');
            }
        }
    }

}
