import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    input,
    OnDestroy,
    output
} from '@angular/core';
import {
    ButtonCloseDirective,
    DropdownComponent,
    DropdownDividerDirective,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormControlDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ModalToggleDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { DashboardTab } from '../../dashboards.interface';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { AsyncPipe, NgClass } from '@angular/common';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Skeleton } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { DashboardsService } from '../../dashboards.service';
import { PermissionsService } from '../../../../permissions/permissions.service';
import { FormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DashboardAllocateModalService } from '../dashboard-allocate-modal/dashboard-allocate-modal.service';

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
    Skeleton,
    DropdownComponent,
    DropdownMenuDirective,
    DropdownItemDirective,
    DropdownToggleDirective,
    AsyncPipe,
    DropdownDividerDirective,
    ButtonCloseDirective,
    FormControlDirective,
    FormLabelDirective,
    FormsModule,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    RequiredIconComponent,
    TranslocoPipe,
    XsButtonDirective,
    ModalToggleDirective
],
    templateUrl: './dashboard-tabs.component.html',
    styleUrl: './dashboard-tabs.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardTabsComponent implements OnDestroy {

    public tabs = input<DashboardTab[]>([]);
    public currentTabId = input<number>(0);
    public dashboardIsLocked = input<boolean>(false);

    public changeTabEvent = output<number>();
    public deleteTabEvent = output<number>();

    public isInitializing: boolean = true;

    public localTabs: DashboardTab[] = [];

    public newTabNameModal: string = ''; // For the modal
    public tabIdModal: number = 0; // For the modal

    private cdr = inject(ChangeDetectorRef);

    public readonly PermissionsService = inject(PermissionsService);

    private readonly subscriptions: Subscription = new Subscription();
    private readonly DashboardsService = inject(DashboardsService);
    private readonly DashboardAllocateModalService = inject(DashboardAllocateModalService);

    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly modalService = inject(ModalService);

    constructor() {
        effect(() => {
            this.localTabs = this.tabs();
            if (this.localTabs.length > 0) {
                this.isInitializing = false;
            }
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public changeTab(tabId: number): void {
        this.changeTabEvent.emit(tabId);
    }

    public deleteTab(tabId: number): void {
        this.deleteTabEvent.emit(tabId);
    }

    public startSharing(tabId: number): void {
        this.subscriptions.add(this.DashboardsService.startSharing(tabId).subscribe((response) => {
            if (response.success) {
                this.notyService.genericInfo(
                    this.TranslocoService.translate('Your dashboard is now shared. Other users of the system can use your shared dashboard tab as an template.')
                );

                // Update local tabs
                let tab = this.localTabs.find(tab => tab.id === tabId);
                if (tab) {
                    tab.shared = true;
                }
                this.cdr.markForCheck();
            } else {
                this.notyService.genericError();
            }
        }));
    }

    public stopSharing(tabId: number): void {
        this.subscriptions.add(this.DashboardsService.stopSharing(tabId).subscribe((response) => {
            if (response.success) {
                this.notyService.genericSuccess(
                    this.TranslocoService.translate('Sharing disabled successfully.')
                );

                // Update local tabs
                let tab = this.localTabs.find(tab => tab.id === tabId);
                if (tab) {
                    tab.shared = false;
                }
                this.cdr.markForCheck();
            } else {
                this.notyService.genericError();
            }
        }));
    }

    public drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.localTabs, event.previousIndex, event.currentIndex);

        // Make sure pinned tabs are always first
        let pinnedTabs = this.localTabs.filter(tab => tab.pinned);
        let unpinnedTabs = this.localTabs.filter(tab => !tab.pinned);

        this.localTabs = pinnedTabs.concat(unpinnedTabs);
        this.saveTabOrder();
    }

    private saveTabOrder() {
        const order: number[] = this.localTabs.map(tab => tab.id);
        this.subscriptions.add(this.DashboardsService.saveTabOrder(order).subscribe((response) => {
            if (response.success) {
                this.notyService.genericSuccess();
            } else {
                this.notyService.genericError();
            }
        }));
    }

    public toggleRenameTabModal(tabId: number) {
        if (this.dashboardIsLocked()) {
            return;
        }

        this.tabIdModal = tabId;
        const tab = this.localTabs.find(tab => tab.id === tabId);
        if (tab) {
            this.newTabNameModal = tab.name;

            // Show modal
            this.modalService.toggle({
                show: true,
                id: 'dashboardRenameTabModal',
            });
        }
    }

    public submitRenameTab() {
        if (this.dashboardIsLocked()) {
            return;
        }

        const tab = this.localTabs.find(tab => tab.id === this.tabIdModal);
        if (tab) {
            this.subscriptions.add(this.DashboardsService.renameDashboardTab(tab.id, this.newTabNameModal).subscribe((response) => {

                if (response.success) {
                    this.notyService.genericSuccess();

                    // Update local name
                    tab.name = this.newTabNameModal;

                    // Close modal
                    this.modalService.toggle({
                        show: false,
                        id: 'dashboardRenameTabModal',
                    });
                } else {
                    this.notyService.genericError();
                }
            }));
        }
    }

    public allocateDashboard(tab: DashboardTab) {
        // Pass the data to the modal
        this.DashboardAllocateModalService.toggleAllocateModal(tab);
    }

}
