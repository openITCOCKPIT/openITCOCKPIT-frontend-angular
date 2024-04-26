// MIT License
// This code is highly inspired by https://github.com/coreui/coreui-angular/blob/main/projects/coreui-angular/src/lib/sidebar/sidebar.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SidebarAction } from './sidebar.interface';

@Injectable({
    providedIn: 'root'
})
export class SidebarService {

    private sidebarState = new BehaviorSubject<SidebarAction>({});
    public sidebarState$ = this.sidebarState.asObservable();

    constructor() {
    }

    public toggle(action: SidebarAction): void {
        this.sidebarState.next(action);
    }
}
