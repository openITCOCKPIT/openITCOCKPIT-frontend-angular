import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { DOCUMENT, NgClass, NgForOf, NgIf } from '@angular/common';

import {
    KtdDragEnd,
    KtdDragStart,
    KtdGridComponent,
    KtdGridDragHandle,
    KtdGridItemComponent,
    KtdGridItemPlaceholder,
    KtdGridLayout,
    KtdGridLayoutItem,
    KtdResizeEnd,
    KtdResizeStart
} from '@katoid/angular-grid-layout';
import { fromEvent, merge, Subscription } from 'rxjs';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { MatSelectChange } from '@angular/material/select';
import { debounceTime, filter } from 'rxjs/operators';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTextDirective,
    CardTitleDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { DashboardColorpickerComponent } from './dashboard-colorpicker/dashboard-colorpicker.component';
import { DashboardTab, DashboardWidget, WidgetGetForRender } from '../dashboards.interface';
import { DashboardsService } from '../dashboards.service';
import { DashboardTabsComponent } from './dashboard-tabs/dashboard-tabs.component';
import { UUID } from '../../../classes/UUID';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    DashboardRenameWidgetModalComponent
} from './dashboard-rename-widget-modal/dashboard-rename-widget-modal.component';
import { DashboardRenameWidgetService } from './dashboard-rename-widget-modal/dashboard-rename-widget.service';
import { DashboardAllocateModalComponent } from './dashboard-allocate-modal/dashboard-allocate-modal.component';
import {
    DashboardUpdateAvailableModalComponent
} from './dashboard-update-available-modal/dashboard-update-available-modal.component';

@Component({
    selector: 'oitc-dashboards-index',
    imports: [
        NgForOf,
        KtdGridComponent,
        KtdGridItemComponent,
        NgIf,
        CardTextDirective,
        CardTitleDirective,
        CardBodyComponent,
        CardHeaderComponent,
        CardComponent,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        TranslocoDirective,
        RouterLink,
        KtdGridItemPlaceholder,
        KtdGridDragHandle,
        DashboardColorpickerComponent,
        DashboardTabsComponent,
        NgClass,
        XsButtonDirective,
        DashboardRenameWidgetModalComponent,
        DashboardAllocateModalComponent,
        DashboardUpdateAvailableModalComponent
    ],
    templateUrl: './dashboards-index.component.html',
    styleUrl: './dashboards-index.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardsIndexComponent implements OnInit, OnDestroy {

    public tabs: DashboardTab[] = [];
    public currentTabId: number = 0;

    public isReadonly: boolean = false;
    public dashboardIsLocked: boolean = false;
    public disableDrag: boolean = false;
    public disableResize: boolean = false;
    public disableRemove: boolean = false;

    public availableWidgets: DashboardWidget[] = [];
    public layout: KtdGridLayout = []; // used by the grid layout library
    public widgets: WidgetGetForRender[] = []; // used by us to show the widgets


    private readonly subscriptions: Subscription = new Subscription();
    private readonly DashboardsService = inject(DashboardsService);
    private readonly DashboardRenameWidgetService = inject(DashboardRenameWidgetService);

    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);

    private cdr = inject(ChangeDetectorRef);

    @ViewChild(KtdGridComponent, {static: false}) grid?: KtdGridComponent;

    // Docs: https://github.com/katoid/angular-grid-layout

    public cols = 12;
    public rowHeight = 15;
    compactType: 'vertical' | 'horizontal' | null = 'vertical';

    transitions: { name: string, value: string }[] = [
        {name: 'ease', value: 'transform 500ms ease, width 500ms ease, height 500ms ease'},
        {name: 'ease-out', value: 'transform 500ms ease-out, width 500ms ease-out, height 500ms ease-out'},
        {name: 'linear', value: 'transform 500ms linear, width 500ms linear, height 500ms linear'},
        {
            name: 'overflowing',
            value: 'transform 500ms cubic-bezier(.28,.49,.79,1.35), width 500ms cubic-bezier(.28,.49,.79,1.35), height 500ms cubic-bezier(.28,.49,.79,1.35)'
        },
        {name: 'fast', value: 'transform 200ms ease, width 200ms linear, height 200ms linear'},
        {name: 'slow-motion', value: 'transform 1000ms linear, width 1000ms linear, height 1000ms linear'},
        {name: 'transform-only', value: 'transform 500ms ease'},
    ];
    currentTransition: string = this.transitions[0].value;

    dragStartThreshold = 0;
    autoScroll = true;


    public autoResize = true;
    preventCollision = false;
    isDragging = false;
    isResizing = false;
    resizeSubscription: Subscription = new Subscription();


    constructor(public elementRef: ElementRef, @Inject(DOCUMENT) public document: Document) {

    }

    public ngOnInit(): void {
        this.resizeSubscription = merge(
            fromEvent(window, 'resize'),
            fromEvent(window, 'orientationchange')
        ).pipe(
            debounceTime(50),
            filter(() => this.autoResize)
        ).subscribe(() => {
            if (this.grid) {
                this.grid.resize();
            }
        });

        this.subscriptions.add(this.resizeSubscription);

        this.loadDashboardsIndex();
    }

    public ngOnDestroy(): void {
        this.resizeSubscription.unsubscribe();
        this.subscriptions.unsubscribe();
    }

    public loadDashboardsIndex(): void {
        this.subscriptions.add(this.DashboardsService.getIndex().subscribe(data => {
            this.tabs = data.tabs;

            if (this.currentTabId === 0 && data.tabs.length > 0) {
                // Mark the first tab as active
                this.currentTabId = data.tabs[0].id;
            }

            this.loadTabContent(this.currentTabId);

            this.cdr.markForCheck();
        }));
    }

    public loadTabContent(tabId: number): void {
        this.layout = [];
        this.widgets = [];
        this.isReadonly = false;
        this.cdr.markForCheck();

        this.subscriptions.add(this.DashboardsService.getWidgetsForTab(tabId).subscribe(data => {
            const widgets = data.widgets.Widget;
            widgets.forEach(widget => {
                const uuid = new UUID();

                let widgetId = uuid.v4();
                // All widgets should have an id from the database !
                if (widget.id) {
                    widgetId = widget.id.toString();
                }

                this.layout.push({
                    id: widgetId,
                    x: widget.col,
                    y: widget.row,
                    w: widget.width,
                    h: widget.height
                });

                // Array for ngFor id has to be a string
                const widgetForLayout: WidgetGetForRender = {...widget, id: widgetId}
                this.widgets.push(widgetForLayout);
            });

            this.tabs.forEach(tab => {
                if (tab.id === this.currentTabId) {
                    if (tab.locked) {
                        this.dashboardIsLocked = true;
                        this.disableDrag = true;
                        this.disableResize = true;
                        this.disableRemove = true;
                    } else {
                        this.dashboardIsLocked = false;
                        this.disableDrag = false;
                        this.disableResize = false;
                        this.disableRemove = false;
                    }

                    if (!tab.isOwner) {
                        this.isReadonly = true;
                        this.dashboardIsLocked = true;
                        this.disableDrag = true;
                        this.disableResize = true;
                        this.disableRemove = true;
                    }
                }
            });

            // If this is a shared tab, check for updates
            this.tabs.forEach(tab => {
                if (tab.id === this.currentTabId && tab.source_tab_id > 0 && tab.check_for_updates) {
                    this.checkForUpdates(this.currentTabId);
                }
            });

            this.cdr.markForCheck();
        }));
    }

    public onTabChange(tabId: number): void {
        this.currentTabId = tabId;

        this.loadTabContent(this.currentTabId);

        this.cdr.markForCheck();

    }

    public onDeleteTab(tabId: number) {
        if (this.dashboardIsLocked) {
            return;
        }

        this.subscriptions.add(this.DashboardsService.deleteDashboardTab(tabId).subscribe(response => {
            if (response.success) {

                // Remove the tab from the local array
                this.tabs = this.tabs.filter(tab => tab.id !== tabId);

                if (this.tabs.length > 0) {
                    this.loadTabContent(this.tabs[0].id);
                    this.currentTabId = this.tabs[0].id;
                } else {
                    //All tabs where removed.
                    //Reload page to get new default tab
                    // todo improve this
                    window.location.href = '/';
                }
            }
        }));

    }

    public onColorChange(color: string, widget: WidgetGetForRender): void {
        this.widgets.forEach(w => {
            if (w.id === widget.id) {
                w.color = color;
            }
        });
        this.saveGrid();
    }

    public saveGrid() {
        if (this.dashboardIsLocked) {
            return;
        }

        if (this.widgets.length === 0) {
            return;
        }

        this.subscriptions.add(this.DashboardsService.saveGrid(this.widgets).subscribe(response => {
            if (response.success) {
                this.notyService.genericSuccess();
                return;
            }

            // Error handling
            this.notyService.genericError();
        }));
    }

    public onDragStarted(event: KtdDragStart): void {
        this.isDragging = true;
    }

    public onResizeStarted(event: KtdResizeStart): void {
        this.isResizing = true;
    }

    public onDragEnded(event: KtdDragEnd): void {
        this.isDragging = false;
    }

    public onResizeEnded(event: KtdResizeEnd): void {
        this.isResizing = false;
    }

    public onLayoutUpdated(layout: KtdGridLayout): void {
        this.layout = layout;

        // Sync the layout with the widgets
        this.widgets.forEach(widget => {
            const layoutItem = layout.find(item => item.id === widget.id);
            if (layoutItem) {
                widget.row = layoutItem.y;
                widget.col = layoutItem.x;
                widget.width = layoutItem.w;
                widget.height = layoutItem.h;
            }
        });
        this.saveGrid();
    }

    public onCompactTypeChange(change: MatSelectChange): void {
        console.log('onCompactTypeChange', change);
        this.compactType = change.value;
    }

    public onTransitionChange(change: MatSelectChange): void {
        console.log('onTransitionChange', change);
        this.currentTransition = change.value;
    }

    public onAutoScrollChange(checked: boolean): void {
        this.autoScroll = checked;
    }

    public onDisableDragChange(checked: boolean): void {
        this.disableDrag = checked;
    }

    public onDisableResizeChange(checked: boolean): void {
        this.disableResize = checked;
    }

    public onDisableRemoveChange(checked: boolean): void {
        this.disableRemove = checked;
    }

    public onAutoResizeChange(checked: boolean): void {
        this.autoResize = checked;
    }

    public onPreventCollisionChange(checked: boolean): void {
        this.preventCollision = checked;
    }

    public onColsChange(event: Event): void {
        this.cols = coerceNumberProperty((event.target as HTMLInputElement).value);
    }

    public onRowHeightChange(event: Event): void {
        this.rowHeight = coerceNumberProperty((event.target as HTMLInputElement).value);
    }

    public onDragStartThresholdChange(event: Event): void {
        this.dragStartThreshold = coerceNumberProperty((event.target as HTMLInputElement).value);
    }

    public generateLayout(): void {
        const layout: KtdGridLayout = [];
        for (let i = 0; i < this.cols; i++) {
            const y = Math.ceil(Math.random() * 4) + 1;
            layout.push({
                x: Math.round(Math.random() * (Math.floor((this.cols / 2) - 1))) * 2,
                y: Math.floor(i / 6) * y,
                w: 2,
                h: y,
                id: i.toString()
                // static: Math.random() < 0.05
            });
        }
        console.log('layout', layout);
        this.layout = layout;
    }

    /** Adds a grid item to the layout */
    public addItemToLayout(): void {
        const maxId = this.layout.reduce((acc, cur) => Math.max(acc, parseInt(cur.id, 10)), -1);
        const nextId = maxId + 1;

        const newLayoutItem: KtdGridLayoutItem = {
            id: nextId.toString(),
            x: 0,
            y: 0,
            w: 2,
            h: 2
        };

        // Important: Don't mutate the array, create new instance. This way notifies the Grid component that the layout has changed.
        this.layout = [
            newLayoutItem,
            ...this.layout
        ];
    }

    /**
     * Fired when a mousedown happens on the remove grid item button.
     * Stops the event from propagating an causing the drag to start.
     * We don't want to drag when mousedown is fired on remove icon button.
     */
    public stopEventPropagation(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
    }

    /** Removes the item from the layout */
    public removeItem(id: string): void {
        // Important: Don't mutate the array. Let Angular know that the layout has changed creating a new reference.
        this.layout = this.ktdArrayRemoveItem(this.layout, (item) => item.id === id);
        this.widgets = this.ktdArrayRemoveItem(this.widgets, (item) => item.id === id);

        this.subscriptions.add(this.DashboardsService.removeWidget(Number(id), this.currentTabId).subscribe(response => {
            if (response.success) {
                this.notyService.genericSuccess();
            } else {
                this.notyService.genericError();
            }
        }));
    }

    public ktdArrayRemoveItem<T>(array: T[], condition: (item: T) => boolean) {
        const arrayCopy = [...array];
        const index = array.findIndex((item) => condition(item));
        if (index > -1) {
            arrayCopy.splice(index, 1);
        }
        return arrayCopy;
    }

    public WidgetTrackById(index: number, item: WidgetGetForRender) {
        return item.id;
    }

    public toggleRenameWidgetModal(widget: WidgetGetForRender): void {
        // Toggle the modal through the service and pass data
        this.DashboardRenameWidgetService.toggleRenameWidgetModal(widget.id, widget.title);
    }

    public onWidgetTitleChanged(event: { id: string, title: string }) {
        // Widget title changed and also update in the database. All we need to do, is to update the title in the local array of widgets
        this.widgets.forEach(widget => {
            if (widget.id === event.id) {
                widget.title = event.title;
            }
        });
    }

    // Checks if an update is available for the given tab id
    private checkForUpdates(tabId: number) {
        this.subscriptions.add(this.DashboardsService.checkForUpdates(tabId).subscribe(response => {
            if (response.updateAvailable) {
                // For the tab is an update available - toggle the modal to inform the user
            }
        }));
    }

}
