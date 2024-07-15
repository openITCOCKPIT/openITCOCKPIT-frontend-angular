import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';

import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
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
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    ServiceescalationContainerResult,
    ServiceescalationGet,
    ServiceescalationPost
} from '../serviceescalations.interface';
import { ServiceescalationsService } from '../serviceescalations.service';
import {
    SelectItemOptionGroup,
    SelectKeyValue,
    SelectKeyValueWithDisabled
} from '../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { PermissionsService } from '../../../permissions/permissions.service';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { NgIf } from '@angular/common';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { IntervalInputComponent } from '../../../layouts/coreui/interval-input/interval-input.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import {
    MultiSelectOptgroupComponent
} from '../../../layouts/primeng/multi-select/multi-select-optgroup/multi-select-optgroup.component';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-serviceescalations-edit',
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
        CardHeaderComponent,
        CardTitleDirective,
        FormDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        PaginatorModule,
        XsButtonDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        NgIf,
        RequiredIconComponent,
        SelectComponent,
        MultiSelectComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        FormControlDirective,
        FormCheckLabelDirective,
        IntervalInputComponent,
        LabelLinkComponent,
        FormCheckInputDirective,
        TrueFalseDirective,
        CardFooterComponent,
        MultiSelectOptgroupComponent,
        FormLoaderComponent
    ],
    templateUrl: './serviceescalations-edit.component.html',
    styleUrl: './serviceescalations-edit.component.css'
})

export class ServiceescalationsEditComponent implements OnInit, OnDestroy {
    public containers: ServiceescalationContainerResult | undefined;
    public post!: ServiceescalationPost;
    public get!: ServiceescalationGet;
    public services: SelectItemOptionGroup[] = [];
    private disabled_services: number[] = [];
    public services_excluded: SelectItemOptionGroup[] = [];
    private disabled_excluded_services: number[] = [];
    public servicegroups: SelectKeyValueWithDisabled[] = [];
    public servicegroups_excluded: SelectKeyValueWithDisabled[] = [];
    public timeperiods: SelectKeyValue[] = [];
    public contacts: SelectKeyValue[] = [];
    public contactgroups: SelectKeyValue[] = [];
    public errors: GenericValidationError | null = null;

    private readonly ServiceescalationsService = inject(ServiceescalationsService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private router: Router = inject(Router);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    private subscriptions: Subscription = new Subscription();


    constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    }


    public ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.ServiceescalationsService.getEdit(id)
            .subscribe((result) => {
                this.get = result.serviceescalation;
                this.post = {
                    id: this.get.id,
                    container_id: this.get.container_id,
                    first_notification: this.get.first_notification,
                    last_notification: this.get.last_notification,
                    notification_interval: this.get.notification_interval,
                    timeperiod_id: this.get.timeperiod_id,
                    escalate_on_recovery: this.get.escalate_on_recovery,
                    escalate_on_warning: this.get.escalate_on_warning,
                    escalate_on_critical: this.get.escalate_on_critical,
                    escalate_on_unknown: this.get.escalate_on_unknown,
                    services: {
                        _ids: this.get.services.filter(obj => obj._joinData.excluded === 0).map(obj => obj.id)
                    },
                    services_excluded: {
                        _ids: this.get.services.filter(obj => obj._joinData.excluded === 1).map(obj => obj.id)
                    },
                    servicegroups: {
                        _ids: this.get.servicegroups.filter(obj => obj._joinData.excluded === 0).map(obj => obj.id)
                    },
                    servicegroups_excluded: {
                        _ids: this.get.servicegroups.filter(obj => obj._joinData.excluded === 1).map(obj => obj.id)
                    },
                    contacts: {
                        _ids: this.get.contacts.map(obj => obj.id)
                    },
                    contactgroups: {
                        _ids: this.get.contactgroups.map(obj => obj.id)
                    }
                };

                this.loadContainers();
                this.loadServices('');
                this.loadExcludedServices('');
                this.loadElements();
                this.loadExcludedServicegroups('');

            })
        );
    }

    public ngOnDestroy(): void {
    }


    public loadContainers() {
        this.subscriptions.add(this.ServiceescalationsService.loadContainers()
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

        this.subscriptions.add(this.ServiceescalationsService.loadElements(containerId)
            .subscribe((result) => {
                this.servicegroups = result.servicegroups;
                this.servicegroups = this.servicegroups.map(obj => ({
                    ...obj,
                    disabled: this.post.servicegroups_excluded._ids.includes(obj.key)
                }));

                this.processChosenExcludedServicegroups();

                this.timeperiods = result.timeperiods;
                this.contacts = result.contacts;
                this.contactgroups = result.contactgroups;
            })
        );
    }

    public loadServices = (searchString: string) => {
        const containerId = this.post.container_id;
        if (!containerId) {
            return;
        }

        this.subscriptions.add(this.ServiceescalationsService.loadServices(containerId, searchString, this.post.services._ids)
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
            })
        );
    }

    public loadExcludedServices = (searchString: string) => {

        const containerId = this.post.container_id;
        if (!containerId) {
            return;
        }
        if (this.post.servicegroups._ids.length === 0) {
            this.post.services_excluded._ids = [];
            return;
        }
        this.subscriptions.add(this.ServiceescalationsService.loadExcludedServices(containerId, searchString, this.post.services_excluded._ids, this.post.servicegroups._ids)
            .subscribe((result) => {
                this.services_excluded = result.excludedServices;
                this.services_excluded.map(obj => {
                    //currentServicesExcludedIds.push(obj.key);
                    obj.items.map(service => {
                        if (service.disabled === true) {
                            this.disabled_excluded_services.push(service.value);
                        }
                    })

                });
                this.processChosenExcludedServices();
            }));

    }

    public loadExcludedServicegroups(searchString: string) {
        const containerId = this.post.container_id;
        if (!containerId) {
            return;
        }

        if (this.post.services._ids.length === 0) {
            this.post.servicegroups_excluded._ids = [];
            return;
        }
        this.subscriptions.add(this.ServiceescalationsService.loadExcludedServicegroups(containerId, searchString, this.post.services._ids, this.post.servicegroups_excluded._ids)
            .subscribe((result) => {
                this.servicegroups_excluded = result.excludedServicegroups;
                this.servicegroups_excluded = this.servicegroups_excluded.map(obj => {
                    return {
                        ...obj,
                        disabled: this.post.servicegroups._ids.includes(obj.key)
                    }
                });
            }));
    }

    public onContainerChange() {
        this.loadElements();
        this.loadServices('');
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
                this.services[key]['items'][itemKey].disabled = this.post.services_excluded._ids.includes(this.services[key]['items'][itemKey].value);

            }
        }
        this.cdr.detectChanges();
    }

    public processChosenExcludedServices() {
        if (this.services_excluded.length === 0) {
            return;
        }
        for (let key in this.services_excluded) {
            for (let itemKey in this.services_excluded[key]['items']) {
                if (this.disabled_excluded_services.includes(this.services_excluded[key]['items'][itemKey].value)) {
                    continue;
                }
                this.services_excluded[key]['items'][itemKey].disabled = this.post.services._ids.includes(this.services_excluded[key]['items'][itemKey].value);
            }
        }
    }

    public processChosenServicegroups() {
        if (this.servicegroups.length === 0) {
            return;
        }
        for (let key in this.servicegroups) {
            this.servicegroups[key].disabled = this.post.servicegroups_excluded._ids.includes(this.servicegroups[key].key);
        }
    }

    public processChosenExcludedServicegroups() {
        if (this.servicegroups_excluded.length === 0) {
            return;
        }
        for (let key in this.servicegroups_excluded) {
            this.servicegroups_excluded[key].disabled = this.post.servicegroups._ids.includes(this.servicegroups_excluded[key].key);
        }
    }


    public submit() {
        this.subscriptions.add(this.ServiceescalationsService.edit(this.post)
            .subscribe((result) => {
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Service escalation');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['serviceescalations', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);


                    this.HistoryService.navigateWithFallback(['/serviceescalations/index']);
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
}
