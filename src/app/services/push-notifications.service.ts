import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PushNotificationsService implements OnDestroy {

    // Cache the browser permissions
    private _hasPermission?: boolean = undefined;

    private hasPermissionSubject$$: Subject<boolean> = new Subject<boolean>();
    public hasPermissionObservable$: Observable<boolean> = this.hasPermissionSubject$$.asObservable();

    constructor() {
    }

    public ngOnDestroy(): void {
    }


    /**
     * Return the browsers notification permission status
     */
    public hasPermission(): boolean {
        if (this._hasPermission === undefined) {
            this.checkPermissions();
        }
        return this._hasPermission === true;
    }


    /**
     * Checks the browser's notification permission status.
     * - If permission is already granted, updates the internal state and notifies subscribers.
     * - If permission is not denied, requests permission from the user.
     * - If granted, updates the internal state and notifies subscribers.
     * This method ensures the service is aware of the user's notification preferences.
     */
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

    public checkBrowserSupport() {
        if (!("Notification" in window)) {
            console.warn('Browser does not support Notifications');
            return false;
        }
        return true;
    };

}
