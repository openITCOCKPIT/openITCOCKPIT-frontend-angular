import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';

import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { SelectKeyValue, SelectKeyValueWithDisabled } from '../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { AllocatedDashboardTab, DashboardTabAllocationPost } from '../dashboard-allocations.interface';
import { ContainersService } from '../../containers/containers.service';
import { DashboardAllocationsService } from '../dashboard-allocations.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { HistoryService } from '../../../history.service';
import { ContainersLoadContainersByStringParams } from '../../containers/containers.interface';
import _ from 'lodash';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';

@Component({
    selector: 'oitc-dashboard-allocations-edit',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        DebounceDirective,
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
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
        FormLoaderComponent
    ],
    templateUrl: './dashboard-allocations-edit.component.html',
    styleUrl: './dashboard-allocations-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardAllocationsEditComponent implements OnInit, OnDestroy {
    private id: number = 0;
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly ContainersService = inject(ContainersService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    public post!: DashboardTabAllocationPost;
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private DashboardAllocationsService = inject(DashboardAllocationsService);
    public containers: SelectKeyValue[] = [];
    public dashboard_tabs: SelectKeyValueWithDisabled[] = [];
    public users: SelectKeyValue[] = [];
    public usergroups: SelectKeyValue[] = [];
    public allocated_dashboard_tabs: AllocatedDashboardTab[] = [];

    private cdr = inject(ChangeDetectorRef);
    public errors: GenericValidationError | null = null;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.load();
    }

    public load() {
        this.subscriptions.add(this.DashboardAllocationsService.getEdit(this.id)
            .subscribe((result) => {
                //Fire on page load
                this.post = result.allocation.DashboardAllocation;
                this.cdr.markForCheck();
                this.loadContainers();
                this.loadElements();
            }));
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
            this.users = result.users;
            this.usergroups = result.usergroups;
            this.allocated_dashboard_tabs = _.filter(result.allocated_dashboard_tabs, (object) => {
                return object.id != this.id;
            });
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

    public submit() {
        this.subscriptions.add(this.DashboardAllocationsService.edit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('Dashboard allocation');
                    const msg = this.TranslocoService.translate('updated successfully');
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
