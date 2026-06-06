import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GlobalLoadingService {

    // Port of GlobalAjax Loader form AngularJS
    // https://github.com/openITCOCKPIT/openITCOCKPIT/blob/2a6516040937262be75ecd0a4de1ff7206aff177/webroot/js/scripts/ng.app.js#L4-L74

    private runningRequestsCounter = 0;
    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    isLoading$ = this.isLoadingSubject.asObservable();

    constructor() {
    }

    showLoader() {
        if (this.runningRequestsCounter === 0) {
            this.isLoadingSubject.next(true);
        }
        this.runningRequestsCounter++;
    }

    hideLoader() {
        this.runningRequestsCounter--;
        if (this.runningRequestsCounter === 0) {
            this.isLoadingSubject.next(false);
        }
    }
}
