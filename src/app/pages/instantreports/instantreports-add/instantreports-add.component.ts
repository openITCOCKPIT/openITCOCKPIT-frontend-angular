import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { UserMacrosModalComponent } from '../../commands/user-macros-modal/user-macros-modal.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { NgForOf, NgIf } from '@angular/common';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { InstantreportPost } from '../instantreports.interface';
import { InstantreportEvaluationTypes, InstantreportObjectTypes } from '../instantreports.enums';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { SelectItemOptionGroup, SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { RouterLink } from '@angular/router';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { HostsService } from '../../hosts/hosts.service';
import { HostgroupsService } from '../../hostgroups/hostgroups.service';
import { TimeperiodsService } from '../../timeperiods/timeperiods.service';
import { InstantreportsService } from '../instantreports.service';
import { ServicesService } from '../../services/services.service';
import { ServicegroupsService } from '../../servicegroups/servicegroups.service';
import { UsersService } from '../../users/users.service';
import { Subscription } from 'rxjs';
import { ServicesLoadServicesByStringParams } from '../../services/services.interface';
import {
    MultiSelectOptgroupComponent
} from '../../../layouts/primeng/multi-select/multi-select-optgroup/multi-select-optgroup.component';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-instantreports-add',
    standalone: true,
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,

        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        BackButtonDirective,
        NavComponent,
        NavItemComponent,
        UserMacrosModalComponent,
        XsButtonDirective,
        CardBodyComponent,
        FormDirective,
        FormsModule,
        PaginatorModule,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        NgIf,
        RequiredIconComponent,
        SelectComponent,
        FormControlDirective,
        RouterLink,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        NgForOf,
        LabelLinkComponent,
        TrueFalseDirective,
        MultiSelectComponent,
        MultiSelectOptgroupComponent,
        CardFooterComponent
    ],
    templateUrl: './instantreports-add.component.html',
    styleUrl: './instantreports-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstantreportsAddComponent implements OnInit, OnDestroy {

    public post: InstantreportPost = this.getDefaultPost();
    public errors: GenericValidationError | null = null;
    public containers: SelectKeyValue[] = [];
    public hosts: SelectKeyValue[] = [];
    public hostgroups: SelectKeyValue[] = [];
    public services: SelectItemOptionGroup[] = [];
    public servicegroups: SelectKeyValue[] = [];
    public timeperiods: SelectKeyValue[] = [];
    public users: SelectKeyValue[] = [];

    private readonly subscriptions: Subscription = new Subscription();
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly InstantreportsService: InstantreportsService = inject(InstantreportsService);
    private readonly TimeperiodsService: TimeperiodsService = inject(TimeperiodsService);
    private readonly HostsService: HostsService = inject(HostsService);
    private readonly HostgroupsService: HostgroupsService = inject(HostgroupsService);
    private readonly ServicesService: ServicesService = inject(ServicesService);
    private readonly ServicegroupsService: ServicegroupsService = inject(ServicegroupsService);
    private readonly UsersService: UsersService = inject(UsersService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    protected readonly ObjectTypesSelect: SelectKeyValue[] = [
        {
            key: InstantreportObjectTypes.Hosts,
            value: this.TranslocoService.translate('Hosts')
        },
        {
            key: InstantreportObjectTypes.Hostgroups,
            value: this.TranslocoService.translate('Host groups')
        },
        {
            key: InstantreportObjectTypes.Services,
            value: this.TranslocoService.translate('Services')
        },
        {
            key: InstantreportObjectTypes.Servicegroups,
            value: this.TranslocoService.translate('Service groups')
        }
    ];

    protected readonly ReflectionStateSelect: SelectKeyValue[] = [
        {
            key: InstantreportObjectTypes.Hosts,
            value: this.TranslocoService.translate('only hard state')
        },
        {
            key: InstantreportObjectTypes.Hostgroups,
            value: this.TranslocoService.translate('soft and hard state')
        }
    ];

    protected readonly SendIntervalSelect: SelectKeyValue[] = [
        {
            key: 0,
            value: this.TranslocoService.translate('NEVER')
        },
        {
            key: 1,
            value: this.TranslocoService.translate('DAY')
        },
        {
            key: 2,
            value: this.TranslocoService.translate('WEEK')
        },
        {
            key: 3,
            value: this.TranslocoService.translate('MONTH')
        },
        {
            key: 4,
            value: this.TranslocoService.translate('YEAR')
        }
    ];

    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.loadContainers();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getDefaultPost(): InstantreportPost {
        return {
            container_id: 0,
            name: '',
            type: InstantreportObjectTypes.Hosts, // 1 - host groups, 2 - hosts, 3 - service groups, 4 - services
            timeperiod_id: 0,
            reflection: 2,// 1 - soft and hard states, 2 - only hard states
            summary: 0,
            downtimes: 0,
            send_email: 0,
            send_interval: 0, // 0 - NEVER
            evaluation: InstantreportEvaluationTypes.HostAndServices,
            hostgroups: {
                _ids: []
            },
            hosts: {
                _ids: []
            },
            servicegroups: {
                _ids: []
            },
            services: {
                _ids: []
            },
            users: {
                _ids: []
            },
        }
    }

    private loadContainers() {
        this.subscriptions.add(this.InstantreportsService.loadContainers().subscribe((result) => {
            this.containers = result;
            this.cdr.markForCheck();
        }));
    }

    private loadTimeperiods() {
        this.subscriptions.add(this.TimeperiodsService.loadTimeperiodsByContainerId(this.post.container_id).subscribe((result) => {
            this.timeperiods = result;
            this.cdr.markForCheck();
        }));
    }

    private loadUsers() {
        this.subscriptions.add(this.UsersService.loadUsersByContainerId(this.post.container_id, this.post.users._ids).subscribe((result) => {
            this.users = result;
            this.cdr.markForCheck();
        }));
    }

    public loadHosts = (searchString: string) => {
        this.subscriptions.add(this.HostsService.loadHostsByContainerId(this.post.container_id, searchString, this.post.hosts._ids)
            .subscribe((result) => {
                this.hosts = result;
                this.cdr.markForCheck();
            })
        );
    }

    public loadServices = (searchString: string) => {
        const params: ServicesLoadServicesByStringParams = {
            'angular': true,
            'filter[servicename]': searchString,
            'selected[]': this.post.services._ids,
            'includeDisabled': true,
            'containerId': this.post.container_id,
            'resolveContainerIds': true
        }

        this.subscriptions.add(this.ServicesService.loadServicesByString(params)
            .subscribe((result) => {
                this.services = result;
                this.cdr.markForCheck();
            })
        );
    }

    public loadHostgroups() {
        this.subscriptions.add(this.HostgroupsService.loadHostgroupsByContainerId(this.post.container_id, this.post.hostgroups._ids)
            .subscribe((result) => {
                this.hostgroups = result;
                this.cdr.markForCheck();
            })
        );
    }

    public loadServicegroups() {
        this.subscriptions.add(this.ServicegroupsService.loadServicegroupsByContainerId(this.post.container_id, this.post.servicegroups._ids)
            .subscribe((result) => {
                this.servicegroups = result;
                this.cdr.markForCheck();
            })
        );
    }

    public onContainerChange() {
        this.loadTimeperiods();
        this.loadUsers();

        switch (this.post.type) {
            case InstantreportObjectTypes.Hosts:
                this.loadHosts('');
                break;
            case InstantreportObjectTypes.Hostgroups:
                this.loadHostgroups();
                break;
            case InstantreportObjectTypes.Services:
                this.loadServices('');
                break;
            case InstantreportObjectTypes.Servicegroups:
                this.loadServicegroups();
                break;
        }
        this.cdr.markForCheck();
    }

    public onTypeChange() {
        // Clear old selection
        this.post.hostgroups._ids = [];
        this.post.hosts._ids = [];
        this.post.servicegroups._ids = [];
        this.post.services._ids = [];

        switch (this.post.type) {
            case InstantreportObjectTypes.Hosts:
                this.loadHosts('');
                break;
            case InstantreportObjectTypes.Hostgroups:
                this.loadHostgroups();
                break;
            case InstantreportObjectTypes.Services:
                this.loadServices('');
                break;
            case InstantreportObjectTypes.Servicegroups:
                this.loadServicegroups();
                break;
        }
        this.cdr.markForCheck();
    }

    public submit() {

        if (this.post.send_email === 0) {
            this.post.send_interval = 0; // Never
            this.post.users._ids = [];
        }

        this.subscriptions.add(this.InstantreportsService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Instant report');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['instantreports', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/instantreports/index']);
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

    protected readonly InstantreportEvaluationTypes = InstantreportEvaluationTypes;
    protected readonly InstantreportObjectTypes = InstantreportObjectTypes;
}
