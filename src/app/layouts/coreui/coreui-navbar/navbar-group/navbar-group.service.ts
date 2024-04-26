import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SidebarGroupAction } from '../sidebar.interface';

@Injectable({
    providedIn: 'root'
})

/**
 * This service only handle open and close of groups in the main navigation
 */
export class NavbarGroupService {

    constructor() {
    }

    private sidebarNavGroupState = new Subject<SidebarGroupAction>();
    public sidebarNavGroupState$ = this.sidebarNavGroupState.asObservable();

    toggle(action: SidebarGroupAction): void {
        this.sidebarNavGroupState.next(action);
    }
}
