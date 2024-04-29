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

    private currentState: SidebarAction = {
        visible: true,
        id: 'sidbar1'
    };

    constructor() {
    }

    public toggleShowOrHideSidebar(): void {
        this.currentState.visible = !this.currentState.visible;

        this.sidebarState.next(this.currentState);
    }

}
