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

    public toggleShowOrHideSidebar(): void {
        this.sidebarState.next({
            visible: 'toggle',
            id: 'sidbar1'
        });
    }

    public isSidebarVisible(): boolean {
        let isVisible = false;
        if (document.getElementById('sidebar1') !== null && document.getElementById('sidebar1') !== undefined && document.getElementById('sidebar1')?.classList !== undefined) {
            isVisible = document.getElementById('sidebar1')!.classList.contains('show');
        }

        return isVisible;
    }

}
