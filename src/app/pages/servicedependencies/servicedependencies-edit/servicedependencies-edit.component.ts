import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
    ServicedependencyGet,
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
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';


@Component({
    selector: 'oitc-servicedependencies-edit',
    standalone: true,
    imports: [
        CoreuiComponent,
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
        MultiSelectOptgroupComponent,
        FormLoaderComponent
    ],
    templateUrl: './servicedependencies-edit.component.html',
    styleUrl: './servicedependencies-edit.component.css'
})
export class ServicedependenciesEditComponent implements OnInit, OnDestroy {
    public containers: ServicedependencyContainerResult | undefined;
    public post!: ServicedependencyPost;
    public get!: ServicedependencyGet;
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

    private subscriptions: Subscription = new Subscription();

    constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.ServicedependenciesService.getEdit(id)
            .subscribe((result) => {
                this.get = result.servicedependency;
                this.post = {
                    id: this.get.id,
                    container_id: this.get.container_id,
                    inherits_parent: this.get.inherits_parent,
                    timeperiod_id: this.get.timeperiod_id,
                    execution_fail_on_ok: this.get.execution_fail_on_ok,
                    execution_fail_on_warning: this.get.execution_fail_on_warning,
                    execution_fail_on_critical: this.get.execution_fail_on_critical,
                    execution_fail_on_unknown: this.get.execution_fail_on_unknown,
                    execution_fail_on_pending: this.get.execution_fail_on_pending,
                    execution_none: this.get.execution_none,
                    notification_fail_on_ok: this.get.notification_fail_on_ok,
                    notification_fail_on_warning: this.get.notification_fail_on_warning,
                    notification_fail_on_critical: this.get.notification_fail_on_critical,
                    notification_fail_on_unknown: this.get.notification_fail_on_unknown,
                    notification_fail_on_pending: this.get.notification_fail_on_pending,
                    notification_none: this.get.notification_none,
                    services: {
                        _ids: this.get.services.filter(obj => obj._joinData.dependent === 0).map(obj => obj.id)
                    },
                    services_dependent: {
                        _ids: this.get.services.filter(obj => obj._joinData.dependent === 1).map(obj => obj.id)
                    },
                    servicegroups: {
                        _ids: this.get.servicegroups.filter(obj => obj._joinData.dependent === 0).map(obj => obj.id)
                    },
                    servicegroups_dependent: {
                        _ids: this.get.servicegroups.filter(obj => obj._joinData.dependent === 1).map(obj => obj.id)
                    }
                };

                this.loadContainers();
                this.loadElements();
                this.loadServices('');
                this.loadDependentServices('');
            })
        );
    }

    public loadContainers() {
        this.subscriptions.add(this.ServicedependenciesService.loadContainers()
            .subscribe((result) => {
                this.containers = result;
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
        if (this.servicegroups.length === 0) {
            return;
        }
        for (let key in this.servicegroups) {
            this.servicegroups[key].disabled = this.post.servicegroups_dependent._ids.includes(this.servicegroups[key].key);
        }
    }

    public processChosenDependentServicegroups() {
        if (this.servicegroups_dependent.length === 0) {
            return;
        }
        for (let key in this.servicegroups_dependent) {
            this.servicegroups_dependent[key].disabled = this.post.servicegroups._ids.includes(this.servicegroups_dependent[key].key);
        }
    }

    public submit() {
        this.subscriptions.add(this.ServicedependenciesService.edit(this.post)
            .subscribe((result) => {
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Service dependency');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['servicedependencies', 'edit', response.id];
                    this.notyService.genericSuccess(msg, title, url);

                    this.router.navigate(['/servicedependencies/index']);
                    this.notyService.scrollContentDivToTop();
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
