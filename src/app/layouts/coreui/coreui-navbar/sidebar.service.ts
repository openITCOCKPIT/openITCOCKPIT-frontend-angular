// MIT License
// This code is highly inspired by https://github.com/coreui/coreui-angular/blob/main/projects/coreui-angular/src/lib/sidebar/sidebar.service.ts

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SidebarAction } from './sidebar.interface';

@Injectable({
    providedIn: 'root'
})
export class SidebarService {

    public sidebarState = new Subject<SidebarAction>();
    public sidebarState$ = this.sidebarState.asObservable();

    constructor() {
    }

    public toggleShowOrHideSidebar(action: SidebarAction): void {
        this.sidebarState.next(action);
    }

}
