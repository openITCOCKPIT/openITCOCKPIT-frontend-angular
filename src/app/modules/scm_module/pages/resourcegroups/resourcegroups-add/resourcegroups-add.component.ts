import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormCheckInputDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ContainersService } from '../../../../../pages/containers/containers.service';
import { HistoryService } from '../../../../../history.service';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { ResourcegroupsService } from '../resourcegroups.service';
import { ResourcegroupsPost } from '../resourcegroups.interface';
import { ContainersLoadContainersByStringParams } from '../../../../../pages/containers/containers.interface';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { ROOT_CONTAINER } from '../../../../../pages/changelogs/object-types.enum';
import { UsersService } from '../../../../../pages/users/users.service';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { ResourcegroupsSubmitType } from '../resourcegroups.enum';
import { MailinglistsService } from '../../mailinglists/mailinglists.service';
import { TimeperiodsService } from '../../../../../pages/timeperiods/timeperiods.service';
import { TimezoneConfiguration, TimezoneService } from '../../../../../services/timezone.service';
import { ScmSettingsIndex } from '../../scmsettings/scmsettings.interface';
import { ScmsettingsService } from '../../scmsettings/scmsettings.service';
import {
    TimeperiodDetailsTooltipComponent
} from '../../../../sla_module/components/timeperiod-details-tooltip/timeperiod-details-tooltip.component';

@Component({
    selector: 'oitc-resourcegroups-add',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        MultiSelectComponent,
        CardFooterComponent,
        FormCheckInputDirective,
        AsyncPipe,
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TimeperiodDetailsTooltipComponent,
        TranslocoPipe
    ],
    templateUrl: './resourcegroups-add.component.html',
    styleUrl: './resourcegroups-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcegroupsAddComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly ContainersService = inject(ContainersService);
    private readonly UsersService = inject(UsersService);
    private readonly MailinglistsService = inject(MailinglistsService);
    private readonly TimeperiodsService: TimeperiodsService = inject(TimeperiodsService);
    private readonly ScmsettingsService: ScmsettingsService = inject(ScmsettingsService);
    private readonly TimezoneService = inject(TimezoneService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    public post = this.getClearForm();
    public createAnother: boolean = false;
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private ResourcegroupsService = inject(ResourcegroupsService);
    public containers: SelectKeyValue[] = [];
    public timeperiods: SelectKeyValue[] = [];
    public serverTimezone: TimezoneConfiguration | null = null;

    public users: SelectKeyValue[] = [];
    public managers: SelectKeyValue[] = [];
    public region_managers: SelectKeyValue[] = [];

    public mailinglists_users: SelectKeyValue[] = [];
    public mailinglists_managers: SelectKeyValue[] = [];
    public mailinglists_region_managers: SelectKeyValue[] = [];

    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;
    protected readonly ResourcegroupsSubmitType = ResourcegroupsSubmitType;
    private router: Router = inject(Router);


    private cdr = inject(ChangeDetectorRef);
    public errors: GenericValidationError | null = null;


    public ngOnInit(): void {
        this.loadContainers();
        this.load();
    }

    private load(): void {
        this.subscriptions.add(this.ScmsettingsService.loadScmSettings()
            .subscribe((result: ScmSettingsIndex) => {
                this.post.reminder_time = result.scm_settings.reminder_time;
                this.post.deadline = result.scm_settings.deadline;
                this.cdr.markForCheck();
            }));

        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe(data => {
            this.serverTimezone = data;
            this.cdr.markForCheck();
        }));
    }

    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.cdr.markForCheck();
            }));
    }

    private loadUsers() {
        if (this.post.container.parent_id === null) {
            return;
        }
        this.subscriptions.add(this.UsersService.loadUsersByContainerId(this.post.container.parent_id, []).subscribe((result) => {
            this.users = result;
            this.managers = result;
            this.region_managers = result;
            this.cdr.markForCheck();
        }));
    }

    private loadMailinglists() {
        if (this.post.container.parent_id === null) {
            return;
        }
        this.subscriptions.add(this.MailinglistsService.loadMailinglistsByContainerId(this.post.container.parent_id, []).subscribe((result) => {
            this.mailinglists_users = result;
            this.mailinglists_managers = result;
            this.mailinglists_region_managers = result;
            this.cdr.markForCheck();
        }));
    }

    private loadTimeperiods() {
        if (this.post.container.parent_id === null) {
            return;
        }
        this.subscriptions.add(this.TimeperiodsService.loadTimeperiodsByContainerId(this.post.container.parent_id).subscribe((result) => {
            this.timeperiods = result;
            this.cdr.markForCheck();
        }));
    }


    public onContainerChange() {
        this.loadUsers();
        this.loadMailinglists();
        this.loadTimeperiods();
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public getClearForm(): ResourcegroupsPost {
        return {
            description: '',
            department: '',
            timeperiod_id: null,
            reminder_time: 15,
            deadline: '',
            container: {
                parent_id: null,
                name: ''
            },
            users: {
                _ids: []
            },
            managers: {
                _ids: []
            },
            region_managers: {
                _ids: []
            },
            mailinglists_users: {
                _ids: []
            },
            mailinglists_managers: {
                _ids: []
            },
            mailinglists_region_managers: {
                _ids: []
            }
        }
    }

    public submit(submitType: ResourcegroupsSubmitType) {
        this.subscriptions.add(this.ResourcegroupsService.createResourcegroup(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('Resource group');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['scm_module', 'resourcegroups', 'edit', response.id];
                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother && submitType) {
                        switch (submitType) {
                            case ResourcegroupsSubmitType.ResourceAdd:
                                this.router.navigate(['/scm_module/resources/add/'], {queryParams: {resourcegroupId: response.id}});
                                break;
                            default:
                                this.HistoryService.navigateWithFallback(['/scm_module/resourcegroups/index']);
                                this.notyService.scrollContentDivToTop();
                                break;
                        }
                        return;
                    }

                    this.post = this.getClearForm();
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();
                    this.errors = null;
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
