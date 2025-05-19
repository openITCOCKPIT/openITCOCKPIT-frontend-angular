import { Injectable, OnDestroy } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PushNotificationsService implements OnDestroy {

    private _connection?: WebSocket;
    private _url: string = '';
    private _key: string = '';
    private _userId: number = 0;
    private _uuid: string | null = null;

    private _success: boolean = false;
    private keepAliveInterval: number | null = null;
    private _uniqid: string | null = null;
    private _hasPermission: boolean = false;

    private hasPermissionSubject$$: Subject<boolean> = new Subject<boolean>();
    public hasPermissionObservable$: Observable<boolean> = this.hasPermissionSubject$$.asObservable();

    constructor() {
        this._onResponse = this._onResponse.bind(this);
        this._parseResponse = this._parseResponse.bind(this);
        this._onError = this._onError.bind(this);
    }

    public ngOnDestroy(): void {
        this.disconnect();
    }

    private _onSuccess(event: MessageEvent) {
        this._success = true;
        let data = JSON.parse(event.data);

        console.info('Connection to push notification service established successfully');
        this._uuid = data.data.uuid;
        this._uniqid = data.uniqid;

        //Filter multiple tabs in same browser window
        let browserUuid = localStorage.getItem('browserUuid');
        if (browserUuid === null) {
            browserUuid = uuidv4();
            localStorage.setItem('browserUuid', browserUuid);
        }

        //console.log(browserUuid);

        this._send(JSON.stringify({
            task: 'register',
            key: this._key,
            uuid: this._uuid,
            data: {
                userId: this._userId,
                browserUuid: browserUuid
            }
        }));

    };

    private _onError(event: Event) {
        this._success = false;
        console.error(event);
    };

    private _onResponse(event: Event) {
        //console.log(event);
    };

    private _onDispatch(event: Event) {
        //console.log(event);
    };

    private _keepAlive() {
        this._send(JSON.stringify({
            task: 'keepAlive',
            key: this._key,
            uuid: this._uuid
        }));
    };

    private _connect() {
        this._connection = new WebSocket(this._url);


        if (this._connection) {
            this._connection.onopen = this._onResponse;
            this._connection.onmessage = this._parseResponse;
            this._connection.onerror = this._onError;
        }


        this.keepAliveInterval = setInterval(() => {
            if (this._success) {
                this._keepAlive();
            }
        }, 30000);

    };

    private _send(json: string) {
        if (this._connection) {
            this._connection.send(json);
        }
    };

    private _parseResponse(event: MessageEvent) {
        let transmitted = JSON.parse(event.data);
        switch (transmitted.type) {
            case 'connection':
                //Trigger _onSuccess callback and start keepAlive
                this._onSuccess(event);
                break;

            case 'message':
                //Server send us a message
                this._onResponse(event);
                break;


            case 'keepAlive':
                // Server is still alive :-)
                break;
        }
    };

    public toJson(task: any, data: any): string {
        let jsonString: string = "";
        jsonString = JSON.stringify({
            task: task,
            data: data,
            uniqid: this._uniqid,
            key: this._key
        });
        return jsonString;
    };

    public setUserId(userId: number) {
        this._userId = userId;
    };

    public setApiKey(key: string) {
        this._key = key;
    };

    public setUrl(url: string) {
        this._url = url;
    };

    public connect() {
        this._connect();
    };

    public onSuccess(callback: () => void) {
        this._onSuccess = callback;
    };

    public onError(callback: () => void) {
        this._onError = callback;
    };

    public onResponse(callback: (event: MessageEvent) => void) {
        this._onResponse = callback;
    };

    public onDispatch(callback: () => void) {
        this._onDispatch = callback;
    };

    public send(json: string) {
        this._send(json);
    };

    public hasPermission(): boolean {
        return this._hasPermission;
    }

    public checkPermissions() {
        if (Notification.permission === "granted") {
            this._hasPermission = true;
            this.hasPermissionSubject$$.next(this._hasPermission);
            return;
        }

        if (Notification.permission !== 'denied') {
            Notification.requestPermission((permission) => {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    this._hasPermission = true;
                    this.hasPermissionSubject$$.next(this._hasPermission);
                }
            });
        }

    };

    public isConnected(): boolean {
        return this._success;
    }

    public sendTestMessage() {
        this._send(JSON.stringify({
            task: 'testMessage',
            key: this._key,
            uuid: this._uuid,
            data: {
                'title': 'Test',
                'message': 'This is a test message',
                'icon': '/img/push_notifications/wh/ServicePushIconUNKNOWN.png'
            }
        }));
    };

    public disconnect() {
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval);
            this.keepAliveInterval = null;
        }
    }

}
