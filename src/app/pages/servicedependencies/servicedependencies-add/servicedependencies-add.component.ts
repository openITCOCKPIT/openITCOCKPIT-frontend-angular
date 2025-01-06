import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    BadgeComponent,
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
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { IntervalInputComponent } from '../../../layouts/coreui/interval-input/interval-input.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgIf } from '@angular/common';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    ServicedependencyContainerResult,
    ServicedependencyPost
} from '../../servicedependencies/servicedependencies.interface';
import { ServicedependenciesService } from '../servicedependencies.service';

import {
    SelectItemOptionGroup,
    SelectKeyValue,
    SelectKeyValueWithDisabled
} from '../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { PermissionsService } from '../../../permissions/permissions.service';
import {
    MultiSelectOptgroupComponent
} from '../../../layouts/primeng/multi-select/multi-select-optgroup/multi-select-optgroup.component';
import { HistoryService } from '../../../history.service';


@Component({
    selector: 'oitc-servicedependencies-add',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        IntervalInputComponent,
        LabelLinkComponent,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgIf,
        RequiredIconComponent,
        SelectComponent,
        TrueFalseDirective,
        XsButtonDirective,
        FormCheckComponent,
        BadgeComponent,
        MultiSelectOptgroupComponent
    ],
    templateUrl: './servicedependencies-add.component.html',
    styleUrl: './servicedependencies-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicedependenciesAddComponent implements OnInit, OnDestroy {
    public containers: ServicedependencyContainerResult | undefined;
    public post: ServicedependencyPost = {} as ServicedependencyPost;
    public services: SelectItemOptionGroup[] = [];
    private disabled_services: number[] = [];
    public services_dependent: SelectItemOptionGroup[] = [];
    private disabled_dependent_services: number[] = [];
    public servicegroups: SelectKeyValueWithDisabled[] = [];
    public servicegroups_dependent: SelectKeyValueWithDisabled[] = [];
    public timeperiods: SelectKeyValue[] = [];

    public errors: GenericValidationError | null = null;

    private readonly ServicedependenciesService = inject(ServicedependenciesService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private router: Router = inject(Router);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    private subscriptions: Subscription = new Subscription();

    constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            //Fire on page load
            this.loadContainers();
            this.post = this.getDefaultPost();
        });
    }

    public loadContainers() {
        this.subscriptions.add(this.ServicedependenciesService.loadContainers()
            .subscribe((result) => {
                this.containers = result;
                this.cdr.markForCheck();
            })
        );
    }

    private loadElements() {
        const containerId = this.post.container_id;

        if (!containerId) {
            return;
        }

        this.subscriptions.add(this.ServicedependenciesService.loadElements(containerId)
            .subscribe((result) => {
                this.servicegroups = result.servicegroups;
                this.servicegroups_dependent = result.servicegroupsDependent;
                this.timeperiods = result.timeperiods;

                this.processChosenServicegroups();
                this.processChosenDependentServicegroups();
                this.cdr.markForCheck();
            })
        );
    }

    public loadServices = (searchString: string) => {
        const containerId = this.post.container_id;
        if (!containerId) {
            return;
        }
        this.subscriptions.add(this.ServicedependenciesService.loadServices(containerId, searchString, this.post.services._ids)
            .subscribe((result) => {
                this.cdr.markForCheck();

                this.services = result.services;
                this.services.map(obj => {
                    obj.items.map(service => {
                        if (service.disabled === true) {
                            this.disabled_services.push(service.value);
                        }
                    })
                });
                this.processChosenServices();
                this.processChosenDependentServices();
            })
        );
    }

    public loadDependentServices = (searchString: string) => {
        const containerId = this.post.container_id;
        if (!containerId) {
            return;
        }

        this.subscriptions.add(this.ServicedependenciesService.loadDependentServices(containerId, searchString, this.post.services_dependent._ids)
            .subscribe((result) => {
                this.cdr.markForCheck();

                this.services_dependent = result.services;
                this.services_dependent.map(obj => {
                    obj.items.map(service => {
                        if (service.disabled === true) {
                            this.disabled_dependent_services.push(service.value);
                        }
                    })

                });
                this.processChosenServices();
                this.processChosenDependentServices();
            }));
    }

    public onContainerChange() {
        this.loadElements();
        this.loadServices('');
        this.loadDependentServices('');
    }

    public processChosenServices() {
        if (this.services.length === 0) {
            return;
        }
        for (let key in this.services) {
            for (let itemKey in this.services[key]['items']) {
                if (this.disabled_services.includes(this.services[key]['items'][itemKey].value)) {
                    continue;
                }
                this.services[key]['items'][itemKey].disabled = this.post.services_dependent._ids.includes(this.services[key]['items'][itemKey].value);

            }
        }
        this.cdr.detectChanges();
    }

    public processChosenDependentServices() {
        this.cdr.markForCheck();

        if (this.services_dependent.length === 0) {
            return;
        }
        for (let key in this.services_dependent) {
            for (let itemKey in this.services_dependent[key]['items']) {
                if (this.disabled_dependent_services.includes(this.services_dependent[key]['items'][itemKey].value)) {
                    continue;
                }
                this.services_dependent[key]['items'][itemKey].disabled = this.post.services._ids.includes(this.services_dependent[key]['items'][itemKey].value);
            }
        }
    }

    public processChosenServicegroups() {
        this.cdr.markForCheck();

        if (this.servicegroups.length === 0) {
            return;
        }
        for (let key in this.servicegroups) {
            this.servicegroups[key].disabled = this.post.servicegroups_dependent._ids.includes(this.servicegroups[key].key);
        }
    }

    public processChosenDependentServicegroups() {
        this.cdr.markForCheck();

        if (this.servicegroups_dependent.length === 0) {
            return;
        }
        for (let key in this.servicegroups_dependent) {
            this.servicegroups_dependent[key].disabled = this.post.servicegroups._ids.includes(this.servicegroups_dependent[key].key);
        }
    }

    private getDefaultPost(): ServicedependencyPost {
        return {
            container_id: null,
            inherits_parent: 0,
            timeperiod_id: null,
            execution_fail_on_ok: 1,
            execution_fail_on_warning: 1,
            execution_fail_on_critical: 1,
            execution_fail_on_unknown: 1,
            execution_fail_on_pending: 1,
            execution_none: 0,
            notification_fail_on_ok: 1,
            notification_fail_on_warning: 1,
            notification_fail_on_critical: 1,
            notification_fail_on_unknown: 1,
            notification_fail_on_pending: 1,
            notification_none: 0,
            services: {
                _ids: []
            },
            services_dependent: {
                _ids: []
            },
            servicegroups: {
                _ids: []
            },
            servicegroups_dependent: {
                _ids: []
            }
        };
    }

    public submit() {
        this.subscriptions.add(this.ServicedependenciesService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Service servicedependency');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['servicedependencies', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    this.post = this.getDefaultPost();
                    this.errors = null;
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();

                    this.HistoryService.navigateWithFallback(['/servicedependencies/index']);
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            })
        );
    }

    public ngOnDestroy(): void {
    }

    public checkExecutionFailureCriteria() {
        this.post.execution_none = (this.post.execution_fail_on_ok | this.post.execution_fail_on_warning | this.post.execution_fail_on_critical | this.post.execution_fail_on_unknown |
            this.post.execution_fail_on_pending) ? 0 : 1;
    }

    public resetExecutionOnFailureCriteria() {
        if (this.post.execution_none === 1) {
            this.post.execution_fail_on_ok = 0;
            this.post.execution_fail_on_warning = 0;
            this.post.execution_fail_on_critical = 0;
            this.post.execution_fail_on_unknown = 0;
            this.post.execution_fail_on_pending = 0;
        } else {
            this.post.execution_fail_on_ok = 1;
            this.post.execution_fail_on_warning = 1;
            this.post.execution_fail_on_critical = 1;
            this.post.execution_fail_on_unknown = 1;
            this.post.execution_fail_on_pending = 1;
        }
    }

    public checkNotificationFailureCriteria() {
        this.post.notification_none = (this.post.notification_fail_on_ok | this.post.notification_fail_on_warning | this.post.notification_fail_on_critical | this.post.notification_fail_on_unknown |
            this.post.notification_fail_on_pending) ? 0 : 1;
    }

    public resetNotificationOnFailureCriteria() {
        if (this.post.notification_none === 1) {
            this.post.notification_fail_on_ok = 0;
            this.post.notification_fail_on_warning = 0;
            this.post.notification_fail_on_critical = 0;
            this.post.notification_fail_on_unknown = 0;
            this.post.notification_fail_on_pending = 0;
        } else {
            this.post.notification_fail_on_ok = 1;
            this.post.notification_fail_on_warning = 1;
            this.post.notification_fail_on_critical = 1;
            this.post.notification_fail_on_unknown = 1;
            this.post.notification_fail_on_pending = 1;
        }
    }
}
