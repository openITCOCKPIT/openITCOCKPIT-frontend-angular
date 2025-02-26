import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ChangecalendarEvent } from '../pages/changecalendars/changecalendars.interface';

@Injectable({
    providedIn: 'root'
})
export class ChangecalendarWidgetModalService {

    private readonly event$$ = new Subject<ChangecalendarEvent>();
    public readonly event$ = this.event$$.asObservable();

    public openChangecalendarModal(event: ChangecalendarEvent) {
        this.event$$.next(event);
    }
}
