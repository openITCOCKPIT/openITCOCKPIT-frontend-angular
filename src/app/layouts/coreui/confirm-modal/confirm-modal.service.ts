import { inject, Injectable, signal } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
import { ModalService } from '@coreui/angular';

@Injectable({
    providedIn: 'root',
})
export class ConfirmModalService {

    // Signal für die UI-Steuerung
    public state = signal<{ message: string; helpMessage: string, data: any, isOpen: boolean }>({
        message: '',
        helpMessage: '',
        data: null, // In case we want to pass some extra data like a ID or UUID or so
        isOpen: false
    });

    private response$ = new Subject<{ decision: boolean, data: any }>();
    private readonly modalService = inject(ModalService);

    public ask(message: string, helpMessage: string = '', data: any = null): Observable<{
        decision: boolean,
        data: any
    }> {
        this.state.set({message, helpMessage, data, isOpen: true});

        this.modalService.toggle({
            show: true,
            id: 'confirmModal'
        });

        return this.response$.asObservable().pipe(take(1));
    }

    public confirm(value: boolean) {
        this.state.set({...this.state(), isOpen: false});
        this.response$.next({
            decision: value,
            data: this.state().data
        });
    }

}
