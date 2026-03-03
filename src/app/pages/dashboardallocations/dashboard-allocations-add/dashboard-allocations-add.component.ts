import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { SelectKeyValue, SelectKeyValueWithDisabled } from '../../../layouts/primeng/select.interface';
import { RouterLink } from '@angular/router';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { ContainersLoadContainersByStringParams } from '../../containers/containers.interface';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ContainersService } from '../../containers/containers.service';
import { HistoryService } from '../../../history.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { DashboardAllocationsService } from '../dashboard-allocations.service';
import { AllocatedDashboardTab, DashboardTabAllocationPost } from '../dashboard-allocations.interface';

import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import _ from 'lodash';

@Component({
    selector: 'oitc-dashboard-allocations-add',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormCheckInputDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        DebounceDirective,
        FormCheckComponent,
        FormCheckLabelDirective,
        TrueFalseDirective
    ],
    templateUrl: './dashboard-allocations-add.component.html',
    styleUrl: './dashboard-allocations-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardAllocationsAddComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly ContainersService = inject(ContainersService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    public post = this.getClearForm();
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private DashboardAllocationsService = inject(DashboardAllocationsService);
    public containers: SelectKeyValue[] = [];
    public dashboard_tabs: SelectKeyValueWithDisabled[] = [];
    public users: SelectKeyValue[] = [];
    public usergroups: SelectKeyValue[] = [];
    public allocated_dashboard_tabs: AllocatedDashboardTab[] = [];

    private cdr = inject(ChangeDetectorRef);
    public errors: GenericValidationError | null = null;

    public ngOnInit(): void {
        this.loadContainers();
    }

    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.cdr.markForCheck();
            }));
    }

    private loadElements() {
        if (this.post.container_id === null) {
            return;
        }
        this.subscriptions.add(this.DashboardAllocationsService.loadElements(this.post.container_id).subscribe((result) => {
            this.dashboard_tabs = result.dashboard_tabs;
            //console.log(this.dashboard_tabs);
            this.users = result.users;
            this.usergroups = result.usergroups;
            this.allocated_dashboard_tabs = result.allocated_dashboard_tabs;
            _.each(this.dashboard_tabs, (dashboardTab) => {
                if (_.findIndex(this.allocated_dashboard_tabs, {'dashboard_tab_id': dashboardTab.key}) === -1) {
                    dashboardTab.disabled = false;
                } else {
                    dashboardTab.disabled = true;
                    dashboardTab.value = dashboardTab.value + '🔐';
                }
            });
            this.cdr.markForCheck();
        }));
    }

    public onContainerChange() {
        this.loadElements();
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public getClearForm(): DashboardTabAllocationPost {
        return {
            name: '',
            container_id: 0,
            dashboard_tab_id: 0,
            pinned: false,
            users: {
                _ids: []
            },
            usergroups: {
                _ids: [],
            }
        }
    }

    public submit() {
        this.subscriptions.add(this.DashboardAllocationsService.createDashboardTabAllocation(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('Dashboard allocation');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['DashboardAllocations', 'edit', response.id];
                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/DashboardAllocations/index']);

                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            }));

    }
}
