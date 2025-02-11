import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, output } from '@angular/core';
import { NavComponent, NavItemComponent } from '@coreui/angular';
import { DashboardTab } from '../../dashboards.interface';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgClass, NgIf } from '@angular/common';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-dashboard-tabs',
    imports: [
        NavComponent,
        NavItemComponent,
        TranslocoDirective,
        NgClass,
        CdkDropList,
        CdkDrag,
        FaIconComponent,
        NgIf
    ],
    templateUrl: './dashboard-tabs.component.html',
    styleUrl: './dashboard-tabs.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardTabsComponent {

    public tabs = input<DashboardTab[]>([]);
    public currentTabId = input<number>(0);

    public changeTabEvent = output<number>();

    public localTabs: DashboardTab[] = [];
    private cdr = inject(ChangeDetectorRef);

    constructor() {
        effect(() => {
            this.localTabs = this.tabs();
        });
    }

    public changeTab(tabId: number): void {
        this.changeTabEvent.emit(tabId);
    }

    public drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.localTabs, event.previousIndex, event.currentIndex);
        console.log(this.localTabs);
    }

}
