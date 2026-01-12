import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { ServiceescalationContainerResult, ServiceescalationPost } from '../serviceescalations.interface';
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

import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { IntervalInputComponent } from '../../../layouts/coreui/interval-input/interval-input.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import {
    MultiSelectOptgroupComponent
} from '../../../layouts/primeng/multi-select/multi-select-optgroup/multi-select-optgroup.component';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-serviceescalations-add',
    imports: [
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
    MultiSelectOptgroupComponent
],
    templateUrl: './serviceescalations-add.component.html',
    styleUrl: './serviceescalations-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ServiceescalationsAddComponent implements OnInit, OnDestroy {
    public containers: ServiceescalationContainerResult | undefined;
    public post: ServiceescalationPost = {} as ServiceescalationPost;
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
        this.route.queryParams.subscribe(params => {
            //Fire on page load
            this.loadContainers();
            this.post = this.getDefaultPost();
            this.cdr.markForCheck();
        });
    }

    public ngOnDestroy(): void {
    }

    private getDefaultPost(): ServiceescalationPost {
        return {
            container_id: null,
            first_notification: 1,
            last_notification: 5,
            notification_interval: 7200,
            timeperiod_id: null,
            escalate_on_recovery: 0,
            escalate_on_warning: 0,
            escalate_on_critical: 0,
            escalate_on_unknown: 0,
            contacts: {
                _ids: []
            },
            contactgroups: {
                _ids: []
            },
            services: {
                _ids: []
            },
            services_excluded: {
                _ids: []
            },
            servicegroups: {
                _ids: []
            },
            servicegroups_excluded: {
                _ids: []
            }
        };
    }

    public loadContainers() {
        this.subscriptions.add(this.ServiceescalationsService.loadContainers()
            .subscribe((result) => {
                this.cdr.markForCheck();
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
                this.cdr.markForCheck();

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
                this.cdr.markForCheck();

                this.services = result.services;
                console.log(this.services);
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
                this.cdr.markForCheck();

                this.services_excluded = result.excludedServices;
                this.services_excluded.map(obj => {
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
                this.cdr.markForCheck();

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
        this.cdr.markForCheck();

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
        this.cdr.markForCheck();

        if (this.servicegroups.length === 0) {
            return;
        }
        for (let key in this.servicegroups) {
            this.servicegroups[key].disabled = this.post.servicegroups_excluded._ids.includes(this.servicegroups[key].key);
        }
    }

    public processChosenExcludedServicegroups() {
        this.cdr.markForCheck();

        if (this.servicegroups_excluded.length === 0) {
            return;
        }
        for (let key in this.servicegroups_excluded) {
            this.servicegroups_excluded[key].disabled = this.post.servicegroups._ids.includes(this.servicegroups_excluded[key].key);
        }
    }


    public submit() {
        this.subscriptions.add(this.ServiceescalationsService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();

                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Service escalation');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['serviceescalations', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    this.post = this.getDefaultPost();
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();
                    this.HistoryService.navigateWithFallback(['/serviceescalations/index']);
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
}
