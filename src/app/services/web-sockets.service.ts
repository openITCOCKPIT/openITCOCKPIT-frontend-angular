import { inject, Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, EMPTY, map, Observable, Subject, Subscription, timer } from 'rxjs';
import { catchError, filter, retry, share, tap } from 'rxjs/operators';
import { WebSocketConfigurationRoot } from '../components/push-notifications/push-notifications.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../tokens/proxy-path.token';
import { v4 as uuidv4 } from 'uuid';

// Type of incoming messages (Messages we receive from the server)
export enum WebsocketMessageType {
    // Internal messages / protocol
    ConnectionEstablished = 'ConnectionEstablished', // Welcome message on new connection
    KeepAlive = 'KeepAlive', // Message to keep the connection alive
    ResponseError = 'Error', // An error happened on the server while precessing the request

    // Data transfer messages
    ExportStatus = 'ExportStatus', // Show if a config refresh is running or not in the header
    RegisterBrowserPushNotification = 'RegisterBrowserPushNotification', // Send this to the server to subscribe to push notifications
    ProcessPushNotification = 'ProcessPushNotification', // Client received a push notification to process
    TestPushNotification = 'TestPushNotification' // Send a message to the server to trigger a test push notification
}

// Data structure of incoming messages (Messages we receive from the server)
export interface WebsocketMessage {
    type: WebsocketMessageType, // The type of the message so clients can determine if the data is relevant or not
    message: string // A simple string with a message
    payload?: any // Complex and unstructured data only the client that process this data knows what to expect from the server (most likely a json blob dayli)
}

export interface WebSocketPushNotificationPayload {
    timestamp: number
    userId: number
    title: string
    message: string
    type: 'host' | 'service'
    hostUuid?: string | null
    serviceUuid?: string | null
    icon: string | null
}

@Injectable({
    providedIn: 'root',
})
export class WebSocketsService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    private socket$?: WebSocketSubject<any>;
    private heartbeatSub?: Subscription;

    public messages$ = new Subject<WebsocketMessage>();

    // We use BehaviorSubjects for the connection status and errors, so that new subscribers get the current status immediately
    public isConnected$ = new BehaviorSubject<boolean>(false);
    public connectionError$ = new BehaviorSubject<boolean>(false);

    // Reference counter of how many components are currently making use o the service
    // so that we do not disconnect in case we still have clients
    private counter: number = 0

    private websocketConfiguration?: WebSocketConfigurationRoot;

    // The UUID of the browser to filter multiple tabs in the same window
    private browserUuid: string | null = null;

    // Each WebSocket Client will get its own UUID from the server
    private clientUuid: string | null = null;

    public constructor() {
        //Filter multiple tabs in same browser window
        let browserUuid = localStorage.getItem('browserUuid');
        if (browserUuid === null) {
            browserUuid = uuidv4();
            localStorage.setItem('browserUuid', browserUuid);
        }
        this.browserUuid = browserUuid;
    }

    public acquire() {
        this.counter++;
    }

    public release() {
        this.counter--;
        if (this.counter < 0) {
            this.counter = 0;
        }
    }

    public connect(): void {
        if (this.websocketConfiguration) {
            this.connectWithConfig(this.websocketConfiguration);
        } else {
            this.getWebSocketConfiguration().subscribe(config => {
                this.websocketConfiguration = config;
                this.connectWithConfig(config);
            });
        }
    }

    private connectWithConfig(config: WebSocketConfigurationRoot): void {
        const userId: number = this.websocketConfiguration?.user.id || 0;
        const url = config.websocket['PUSH_NOTIFICATIONS.URL'] + `?userId=${userId}&browserUuid=${this.browserUuid}`;
        const apikey = String(this.websocketConfiguration?.websocket['SUDO_SERVER.API_KEY']);

        if (!this.socket$ || this.socket$.closed) {
            console.log('Connecting to WebSocket backend...');
            this.socket$ = webSocket({
                url: url,
                protocol: ['access_token', apikey],
                // Callback in case the connection gets closed (e.g. by the Server)
                closeObserver: {
                    next: (event: CloseEvent) => {
                        //console.log('ERROR', event);
                        this.connectionError$.next(true);
                        this.isConnected$.next(false);
                    }
                },
                // Callback when the connection could be established successfully
                openObserver: {
                    next: () => {
                        // Connection established successfully.
                        this.connectionError$.next(false);
                        this.startHeartbeat();
                    }
                }
            });

            this.socket$.pipe(
                retry({delay: 3000}), // Auto re-connect every 3 seconds
                catchError(err => {
                    this.clientUuid = null;
                    this.connectionError$.next(true);
                    return EMPTY;
                }),
                tap((msg: WebsocketMessage) => {
                    // This will catch all messages as well
                    // We use this to catch the connection established message to store the client uuid
                    if (msg.type === WebsocketMessageType.ConnectionEstablished) {
                        this.clientUuid = msg.payload.clientUuid;

                        // openObserver triggers after the initial handshake with the server is completed.
                        // But to be "connected" in a way we can work with the socket, we wait until we receive
                        // a ConnectionEstablished message from the server
                        this.isConnected$.next(true);
                    }

                    // At lest log errors to the console
                    if (msg.type === WebsocketMessageType.ResponseError) {
                        console.log(msg);
                    }
                }),
                filter((msg: WebsocketMessage) => msg.type !== WebsocketMessageType.KeepAlive), // Do not pass KeepAlive messages to subscribers of the messages$ subject
                share() // Ensures, that only one connects exists (in case used by multiple components)
            ).subscribe(this.messages$);
        }
    }

    public disconnect() {
        this.socket$?.complete();
        this.heartbeatSub?.unsubscribe();
    }

    private startHeartbeat() {
        // Frequently send a "Ping" package to the server
        // As browsers do not provide access the native Ping/Pong method of WebSockets. (As far as I know)
        this.heartbeatSub = timer(10000, 30000).pipe(
            tap(() => this.send({
                type: WebsocketMessageType.KeepAlive,
                message: 'KeepAlive'
            }))
        ).subscribe();
    }

    public send(msg: WebsocketMessage) {
        // If the payload is an object, add clientUuid and browserUuid if not already present
        if (msg.payload && typeof msg.payload === 'object' && !Array.isArray(msg.payload)) {
            if (!('clientUuid' in msg.payload) && this.clientUuid) {
                msg.payload.clientUuid = this.clientUuid;
            }
            if (!('browserUuid' in msg.payload) && this.browserUuid) {
                msg.payload.browserUuid = this.browserUuid;
            }
        }
        //console.log('SEND', msg);
        this.socket$?.next(msg);
    }

    public getWebSocketConfiguration(): Observable<WebSocketConfigurationRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<WebSocketConfigurationRoot>(`${proxyPath}/angular/push_configuration.json`, {
            params: {
                'angular': true,
                'includeUser': true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    /**
     * Is true, if this user has at least one contact with "Enable Push Notifications"
     */
    public hasPushContact(): boolean {
        return this.websocketConfiguration?.user.hasPushContact === true;
    }
}
