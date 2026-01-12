import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import {
    MultiSelectOptgroupComponent
} from '../../../layouts/primeng/multi-select/multi-select-optgroup/multi-select-optgroup.component';

import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { InstantreportPost } from '../instantreports.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { SelectItemOptionGroup, SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ServicesLoadServicesByStringParams } from '../../services/services.interface';
import { InstantreportEvaluationTypes, InstantreportObjectTypes } from '../instantreports.enums';
import { HostsService } from '../../hosts/hosts.service';
import { HostgroupsService } from '../../hostgroups/hostgroups.service';
import { TimeperiodsService } from '../../timeperiods/timeperiods.service';
import { InstantreportsService } from '../instantreports.service';
import { ServicesService } from '../../services/services.service';
import { ServicegroupsService } from '../../servicegroups/servicegroups.service';
import { UsersService } from '../../users/users.service';
import { HistoryService } from '../../../history.service';
import { DebounceDirective } from '../../../directives/debounce.directive';

@Component({
    selector: 'oitc-instantreports-edit',
    imports: [
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
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
    LabelLinkComponent,
    MultiSelectComponent,
    MultiSelectOptgroupComponent,
    NavComponent,
    NavItemComponent,
    PermissionDirective,
    RequiredIconComponent,
    SelectComponent,
    TranslocoDirective,
    TrueFalseDirective,
    XsButtonDirective,
    RouterLink,
    FormLoaderComponent,
    DebounceDirective
],
    templateUrl: './instantreports-edit.component.html',
    styleUrl: './instantreports-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstantreportsEditComponent {
    public post!: InstantreportPost;
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
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

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

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadInstantreport(id);
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private loadInstantreport(id: number) {
        this.loadContainers();

        this.subscriptions.add(this.InstantreportsService.getInstantreportEdit(id).subscribe(instantreport => {
            this.cdr.markForCheck();

            this.post = instantreport;
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
        }));
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
    }

    public onSendCheckboxChange(event:any) {
        if(event === 1 && this.post.send_interval === 0) {
            this.post.send_interval = 1; // Day
            this.cdr.markForCheck();
        }
    }

    public submit() {

        if (this.post.send_email === 0) {
            this.post.send_interval = 0; // Never
            this.post.users._ids = [];
        }

        this.subscriptions.add(this.InstantreportsService.saveInstantreportEdit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Instant report');
                    const msg = this.TranslocoService.translate('updated successfully');
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
