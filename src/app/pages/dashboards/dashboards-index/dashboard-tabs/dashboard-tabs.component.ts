import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, output } from '@angular/core';
import { NavComponent, NavItemComponent } from '@coreui/angular';
import { DashboardTab } from '../../dashboards.interface';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgClass } from '@angular/common';

@Component({
    selector: 'oitc-dashboard-tabs',
    imports: [
        NavComponent,
        NavItemComponent,
        TranslocoDirective,
        NgClass
    ],
    templateUrl: './dashboard-tabs.component.html',
    styleUrl: './dashboard-tabs.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardTabsComponent {

    public tabs = input<DashboardTab[]>([]);
    public currentTabId = input<number>(0);

    public changeTabEvent = output<number>();

    private cdr = inject(ChangeDetectorRef);

    constructor() {

    }

    public changeTab(tabId: number): void {
        this.changeTabEvent.emit(tabId);
    }

}
