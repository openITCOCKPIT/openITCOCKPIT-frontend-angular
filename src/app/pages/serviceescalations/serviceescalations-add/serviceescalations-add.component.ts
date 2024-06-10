import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { City, ServiceescalationContainerResult, ServiceescalationPost } from '../serviceescalations.interface';
import { ServiceescalationsService } from '../serviceescalations.service';
import {
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
import { SelectItemGroup, TreeNode } from 'primeng/api';
import {
    MultiSelectOptgroupComponent
} from '../../../layouts/primeng/multi-select/multi-select-optgroup/multi-select-optgroup.component';

@Component({
    selector: 'oitc-serviceescalations-add',
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
        MultiSelectOptgroupComponent
    ],
    templateUrl: './serviceescalations-add.component.html',
    styleUrl: './serviceescalations-add.component.css'
})

export class ServiceescalationsAddComponent implements OnInit, OnDestroy {
    public containers: ServiceescalationContainerResult | undefined;
    public post: ServiceescalationPost = {} as ServiceescalationPost;
    public services: SelectKeyValueWithDisabled[] = [];
    public services_excluded: SelectKeyValueWithDisabled[] = [];
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

    private subscriptions: Subscription = new Subscription();

    public options = [
        {
            label: 'Category-1',
            value: {
                label: 'Category-1',
                childOptions: [
                    {
                        label: 'Sub-Category-1-1',
                        value: {
                            label: 'Sub-Category-1-1',
                            childOptions: []
                        }
                    },
                    {
                        label: 'Sub-Category-1-2',
                        value: {
                            label: 'Sub-Category-1-2',
                            childOptions: []
                        }
                    }
                ],
                selectedChildOptions: []
            }
        },
        {
            label: 'Category-2',
            value: {
                label: 'Category-2',
                childOptions: [
                    {
                        label: 'Sub-Category-2-1',
                        value: {
                            label: 'Sub-Category-2-1',
                            childOptions: []
                        }
                    },
                    {
                        label: 'Sub-Category-2-2',
                        value: {
                            label: 'Sub-Category-2-2',
                            childOptions: []
                        }
                    },
                    {
                        label: 'Sub-Category-2-3',
                        value: {
                            label: 'Sub-Category-2-3',
                            childOptions: []
                        }
                    }
                ],
                selectedChildOptions: []
            }
        },
        {
            label: 'Category-3',
            value: {
                label: 'Category-3',
                childOptions: [
                    {
                        label: 'Sub-Category-3-1',
                        value: {
                            label: 'Sub-Category-3-1',
                            childOptions: []
                        }
                    },
                    {
                        label: 'Sub-Category-3-2',
                        value: {
                            label: 'Sub-Category-3-2',
                            childOptions: []
                        }
                    }
                ],
                selectedChildOptions: []
            }
        }
    ];



    public groupedCities!: SelectItemGroup[];
    public selectedCities!: City[];


    constructor(private route: ActivatedRoute) {
        // IMPORTANT for the searchCallback the use the same "this" context
        this.loadServices = this.loadServices.bind(this);
        this.loadExcludedServices = this.loadExcludedServices.bind(this);
    }


    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            //Fire on page load
            this.loadContainers();
            this.post = this.getDefaultPost();
        });
        this.groupedCities = [
            {
                label: 'Germany',
                value: 'de',
                items: [
                    { label: 'Berlin', value: 'Berlin' },
                    { label: 'Frankfurt', value: 'Frankfurt' },
                    { label: 'Hamburg', value: 'Hamburg' },
                    { label: 'Munich', value: 'Munich' }
                ]
            },
            {
                label: 'USA',
                value: 'us',
                items: [
                    { label: 'Chicago', value: 'Chicago' },
                    { label: 'Los Angeles', value: 'Los Angeles' },
                    { label: 'New York', value: 'New York' },
                    { label: 'San Francisco', value: 'San Francisco' }
                ]
            },
            {
                label: 'Japan',
                value: 'jp',
                items: [
                    { label: 'Kyoto', value: 'Kyoto' },
                    { label: 'Osaka', value: 'Osaka' },
                    { label: 'Tokyo', value: 'Tokyo' },
                    { label: 'Yokohama', value: 'Yokohama' }
                ]
            },
        ] as SelectItemGroup[];

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

    public loadServices(searchString: string) {
        const containerId = this.post.container_id;
        if (!containerId) {
            return;
        }
        this.subscriptions.add(this.ServiceescalationsService.loadServices(containerId, searchString, this.post.services._ids)
            .subscribe((result) => {
                /*
                let reorderedServices: SelectKeyValueWithDisabledWithGroup[] = [];
                for (let key in result.services) {
                    console.log(result.services[key]);
                    let groupName = result.services[key].value._matchingData.Hosts.name;
                    if(reorderedServices.hasOwnProperty(groupName) === false) {
                        let optGroup: SelectKeyValueWithDisabledWithGroup = {
                            label: groupName,
                            items: []
                        };
                    }
                    //reorderedServices[groupName].items.push(result.services[key]);



                }

                 */



                /*
                this.hosts = this.hosts.map(obj => {
                    currentHostsIds.push(obj.key);
                    return {
                        ...obj,
                        disabled: this.post.hosts_excluded._ids.includes(obj.key)
                    }
                });

                 */

                                this.services = result.services;

                                this.services = this.services
                                    .map(obj => {
                                    //Check if the service is disabled (inactive)
                                    let serviceSuffix: string = obj.disabled ? '🔌' : '';
                                    return {
                                        ...obj,
                                        disabled: this.post.services_excluded._ids.includes(obj.key)
                                        //servicename: obj.value + ' ' + serviceSuffix
                                    }
                                });



                //console.log(this.services);

                this.processChosenExcludedServices();
            })
        );
    }

    public loadExcludedServices(searchString: string) {
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
                let currentServicesExcludedIds: number[] = [];
                this.services_excluded = result.excludedServices;
                this.services_excluded = this.services_excluded.map(obj => {
                    currentServicesExcludedIds.push(obj.key);
                    return {
                        ...obj,
                        disabled: this.post.services._ids.includes(obj.key)
                    }
                });
                this.post.services_excluded._ids = this.post.services_excluded._ids.filter(
                    id => currentServicesExcludedIds.includes(id)
                );
            }));
    }

    public loadExcludedServicegroups(searchString: string) {
        const containerId = this.post.container_id;
        if (!containerId) {
            return;
        }
        console.log(this.post.servicegroups_excluded._ids);

        if (this.post.services._ids.length === 0) {
            this.post.servicegroups_excluded._ids = [];
            return;
        }
        this.subscriptions.add(this.ServiceescalationsService.loadExcludedServicegroups(containerId, searchString, this.post.services._ids, this.post.servicegroups_excluded._ids)
            .subscribe((result) => {
                let currentServiceGroupsExcludedIds: number[] = [];
                this.servicegroups_excluded = result.excludedServicegroups;
                this.servicegroups_excluded = this.servicegroups_excluded.map(obj => {
                    currentServiceGroupsExcludedIds.push(obj.key);
                    return {
                        ...obj,
                        disabled: this.post.servicegroups._ids.includes(obj.key)
                    }
                });
                this.post.servicegroups_excluded._ids = this.post.servicegroups_excluded._ids.filter(
                    id => currentServiceGroupsExcludedIds.includes(id)
                );
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
            this.services[key].disabled = this.post.services_excluded._ids.includes(this.services[key].key);
        }
    }

    public processChosenExcludedServices() {
        if (this.services_excluded.length === 0) {
            return;
        }

        for (let key in this.services_excluded) {
            this.services_excluded[key].disabled = this.post.services._ids.includes(this.services_excluded[key].key);
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
        this.subscriptions.add(this.ServiceescalationsService.add(this.post)
            .subscribe((result) => {
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Service escalation');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['serviceescalations', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    this.post = this.getDefaultPost();
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();
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
