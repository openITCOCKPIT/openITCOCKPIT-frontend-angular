import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, output } from '@angular/core';
import {
    ButtonCloseDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormLabelDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ModalToggleDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PermissionsService } from '../../../../permissions/permissions.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { DashboardAllocateModalService } from './dashboard-allocate-modal.service';
import { DashboardTab, DashboardTabAllocation } from '../../dashboards.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { ContainersLoadContainersByStringParams } from '../../../containers/containers.interface';
import { FormErrorDirective } from '../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { GenericValidationError } from '../../../../generic-responses';
import { MultiSelectComponent } from '../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NotyService } from '../../../../layouts/coreui/noty.service';

@Component({
    selector: 'oitc-dashboard-allocate-modal',
    imports: [
        ButtonCloseDirective,
        FaIconComponent,
        FormsModule,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        TranslocoDirective,
        XsButtonDirective,
        ModalToggleDirective,
        AsyncPipe,
        NgIf,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        SelectComponent,
        FormControlDirective,
        MultiSelectComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective
    ],
    templateUrl: './dashboard-allocate-modal.component.html',
    styleUrl: './dashboard-allocate-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardAllocateModalComponent implements OnDestroy {

    public triggerReloadEvent = output<boolean>();

    public tab?: DashboardTab;
    public originalTab?: DashboardTab;
    public errors: GenericValidationError | null = null;

    public mode: 'add' | 'edit' = 'add';

    public containers: SelectKeyValue[] = [];
    public dashboardTabs: SelectKeyValue[] = [];
    public users: SelectKeyValue[] = [];
    public usergroups: SelectKeyValue[] = [];

    public PermissionsService: PermissionsService = inject(PermissionsService);

    private readonly DashboardAllocateModalService = inject(DashboardAllocateModalService);
    private readonly modalService = inject(ModalService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);


    private cdr = inject(ChangeDetectorRef);

    constructor() {
        this.subscriptions.add(this.DashboardAllocateModalService.event$.subscribe((tab) => {
            this.errors = null;

            this.tab = tab;

            this.mode = 'add';
            
            if (tab.dashboard_tab_allocation?.id) {
                // Edit
                this.mode = 'edit';
                this.loadElements();
            } else {
                // Add - create some default data
                this.tab.dashboard_tab_allocation = {
                    name: tab.name,
                    container_id: 0,
                    dashboard_tab_id: tab.id,
                    pinned: false,
                    users: {
                        _ids: []
                    },
                    usergroups: {
                        _ids: [],
                    }
                }
            }

            if (this.containers.length === 0) {
                // Load containers if not already loaded
                this.loadContainers();
            }
            this.originalTab = JSON.parse(JSON.stringify(this.tab)) as DashboardTab;

            // Open the modal
            this.modalService.toggle({
                show: true,
                id: 'dashboardAllocateModal',
            });

        }));

        this.subscriptions.add(
            this.modalService.modalState$.subscribe((event: any) => {
                if (event.show === false) {
                    this.cleanup();
                }
            })
        )

        this.cdr.markForCheck();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private loadContainers() {
        this.containers = [];
        this.cdr.markForCheck();

        const params: ContainersLoadContainersByStringParams = {
            angular: true,
            'filter[Containers.name]': '',
        };

        this.subscriptions.add(this.DashboardAllocateModalService.loadContainersByString(params).subscribe((response) => {
            this.containers = response.containers;
            this.cdr.markForCheck();
        }));
    }

    public loadElements() {
        if (!this.tab || !this.tab.dashboard_tab_allocation) {
            return;
        }

        if (this.tab.dashboard_tab_allocation.container_id < 1) {
            return;
        }

        this.subscriptions.add(this.DashboardAllocateModalService.loadElementsByContainerId(this.tab.dashboard_tab_allocation.container_id).subscribe((response) => {
            this.dashboardTabs = response.dashboard_tabs;
            this.users = response.users;
            this.usergroups = response.usergroups;

            this.cdr.markForCheck();
        }));

    }

    public deleteAllocation() {
        if (!this.tab || !this.tab.dashboard_tab_allocation) {
            return;
        }

        if (!this.tab.dashboard_tab_allocation.id) {
            return;
        }

        this.subscriptions.add(this.DashboardAllocateModalService.deleteDashboardAllocation(this.tab.dashboard_tab_allocation.id).subscribe((response) => {
            this.cdr.markForCheck();

            const title = this.TranslocoService.translate('Dashboard tab allocation');
            const msg = this.TranslocoService.translate('deleted successfully');

            this.notyService.genericSuccess(msg, title);

            this.modalService.toggle({
                show: false,
                id: 'dashboardAllocateModal'
            });
            this.triggerReloadEvent.emit(true);
        }));
    }

    public createAllocation() {
        if (!this.tab || !this.tab.dashboard_tab_allocation) {
            return;
        }

        this.subscriptions.add(this.DashboardAllocateModalService.addDashboardAllocation(this.tab.dashboard_tab_allocation).subscribe((response) => {
            this.cdr.markForCheck();

            if (response.success) {
                const data = response.data.allocation as DashboardTabAllocation;

                const title = this.TranslocoService.translate('Dashboard tab allocation');
                const msg = this.TranslocoService.translate('created successfully');
                const url = ['DashboardAllocations', 'edit', data.id];

                this.notyService.genericSuccess(msg, title, url);
                this.errors = null;

                this.modalService.toggle({
                    show: false,
                    id: 'dashboardAllocateModal'
                });
                this.triggerReloadEvent.emit(true);
                return;
            }

            // Error
            this.notyService.genericError();
            const errorResponse: GenericValidationError = response.data as GenericValidationError;
            if (response) {
                this.errors = errorResponse;
            }
        }));
    }

    public updateAllocation() {
        if (!this.tab || !this.tab.dashboard_tab_allocation) {
            return;
        }

        this.subscriptions.add(this.DashboardAllocateModalService.editDashboardAllocation(this.tab.dashboard_tab_allocation).subscribe((response) => {
            this.cdr.markForCheck();

            if (response.success) {
                const data = response.data.allocation as DashboardTabAllocation;

                const title = this.TranslocoService.translate('Dashboard tab allocation');
                const msg = this.TranslocoService.translate('updated successfully');
                const url = ['DashboardAllocations', 'edit', data.id];

                this.notyService.genericSuccess(msg, title, url);
                this.errors = null;

                this.modalService.toggle({
                    show: false,
                    id: 'dashboardAllocateModal'
                });
                this.triggerReloadEvent.emit(true);
                return;
            }

            // Error
            this.notyService.genericError();
            const errorResponse: GenericValidationError = response.data as GenericValidationError;
            if (response) {
                this.errors = errorResponse;
            }
        }));
    }

    protected cleanup(): void {
        if (!this.tab || !this.originalTab) {
            return;
        }
        this.tab.dashboard_tab_allocation = this.originalTab.dashboard_tab_allocation;
    }

}
