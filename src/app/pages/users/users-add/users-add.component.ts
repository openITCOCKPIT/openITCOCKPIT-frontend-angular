import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import {
    UserAddContainerRolePermission,
    UserContainerPermission,
    UserDefaultTemplatesParams,
    UserLocaleOption,
    UserPost,
    UserTimezonesSelect
} from '../users.interface';
import { Subscription } from 'rxjs';
import { UsersService } from '../users.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { HistoryService } from '../../../history.service';
import { SelectKeyValue, SelectKeyValueString } from '../../../layouts/primeng/select.interface';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { SliderTimeComponent } from '../../../components/slider-time/slider-time.component';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { AsyncPipe, NgClass } from '@angular/common';
import { ProfileService } from '../../profile/profile.service';
import { PermissionLevel } from '../permission-level';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';
import { PermissionsService } from '../../../permissions/permissions.service';
import { ROOT_CONTAINER } from '../../changelogs/object-types.enum';
import { MultiSelectChangeEvent } from 'primeng/types/multiselect';
import { UserDefaultTemplatesPost } from '../../userdefaulttemplates/user-default-templates.interface';

@Component({
    selector: 'oitc-users-add',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormCheckInputDirective,
        FormDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        MultiSelectComponent,
        FormLabelDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        RequiredIconComponent,
        SelectComponent,
        FormCheckComponent,
        FormCheckLabelDirective,
        TrueFalseDirective,
        FormControlDirective,
        SliderTimeComponent,
        NgOptionTemplateDirective,
        NgSelectComponent,
        NgOptionHighlightDirective,
        RowComponent,
        ColComponent,
        InputGroupComponent,
        NgClass,
        BadgeOutlineComponent,
        AsyncPipe,
        TranslocoPipe
    ],
    templateUrl: './users-add.component.html',
    styleUrl: './users-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersAddComponent implements OnInit, OnDestroy {

    public createAnother: boolean = false;
    public post: UserPost = this.getDefaultPost();
    public errors: GenericValidationError | null = null;

    public usercontainerroles: SelectKeyValue[] = [];
    public usergroups: SelectKeyValue[] = [];
    public containers: SelectKeyValue[] = [];
    public userDefaultTemplates: SelectKeyValue[] = [];
    public userDefaultTemplateDetails: UserDefaultTemplatesPost[] = [];
    public localeOptions: UserLocaleOption[] = [];
    public dateformats: SelectKeyValueString[] = [];
    public timezones: UserTimezonesSelect[] = [];
    public serverTime: string = '';
    public serverTimeZone: string = '';

    public selectedUserContainers: number[] = [];
    public selectedUserContainerWithPermission: UserContainerPermission[] = [];
    public userContainerRoleContainerPermissions: UserAddContainerRolePermission[] = [];

    public readonly PermissionsService: PermissionsService = inject(PermissionsService);

    private subscriptions: Subscription = new Subscription();
    private readonly UsersService: UsersService = inject(UsersService);
    private readonly ProfileService: ProfileService = inject(ProfileService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.loadContainerRoles('');
        this.loadContainer();
        this.loadUsergroups();
        this.loadDateformats();
        this.loadLocaleOptions();
        this.loadUserDefaultTemplates();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getDefaultPost(): UserPost {
        return {
            firstname: '',
            lastname: '',
            email: '',
            phone: '',
            is_active: 1,
            showstatsinmenu: 0,
            paginatorlength: 25,
            dashboard_tab_rotation: 0,
            recursive_browser: 0,
            dateformat: 'H:i:s - d.m.Y',
            timezone: 'Europe/Berlin',
            i18n: 'en_US',
            password: '',
            confirm_password: '',
            is_oauth: false,
            usergroup_id: 0,
            usercontainerroles: {
                _ids: []
            },
            ContainersUsersMemberships: {},
            apikeys: [],
            container_id: 0,
            user_default_template_id: 0
        }
    }

    public loadContainerRoles = (searchString: string): void => {
        let selected = this.post.usercontainerroles._ids;

        this.subscriptions.add(this.UsersService.loadUserContainerRoles(searchString, selected)
            .subscribe((result) => {
                this.usercontainerroles = result;
                this.cdr.markForCheck();
            }));
    }

    public loadContainer() {
        this.subscriptions.add(this.UsersService.loadContainersForAngular().subscribe((result) => {
            this.containers = result.containers;
            this.cdr.markForCheck();
        }));
    }

    public loadUsergroups() {
        this.subscriptions.add(this.UsersService.loadUsergroups().subscribe((result) => {
            this.usergroups = result;
            this.cdr.markForCheck();
        }));
    }

    public loadDateformats() {
        this.subscriptions.add(this.UsersService.getDateformats().subscribe((result) => {
            this.dateformats = result.dateformats;
            this.post.dateformat = result.defaultDateFormat;
            this.timezones = result.timezones;
            this.serverTimeZone = result.serverTimeZone;
            this.serverTime = result.serverTime;
            this.cdr.markForCheck();
        }));
    }

    public loadLocaleOptions() {
        this.subscriptions.add(this.UsersService.getLocaleOptions().subscribe((result) => {
            this.localeOptions = result;
            this.cdr.markForCheck();
        }));
    }


    public addApikey(): void {
        this.subscriptions.add(this.ProfileService.generateNewApiKey()
            .subscribe((result) => {
                this.post.apikeys = [...this.post.apikeys, result];
                this.cdr.markForCheck();
            })
        );
    }

    public removeApikey(index: number): void {
        this.post.apikeys.splice(index, 1);
        this.cdr.markForCheck();
    }

    public refreshApiKey(index: number): void {
        this.subscriptions.add(this.ProfileService.generateNewApiKey()
            .subscribe((result) => {
                this.post.apikeys[index].apikey = result.apikey;

                // Get a new reference to trigger the change detection
                this.post.apikeys = [...this.post.apikeys];

                this.cdr.markForCheck();
            })
        );
    }

    public onUsercontainerrolesSelectChange(event: any) {
        // Called when an usercontainerrole is selected or unselected

        if (this.post.usercontainerroles._ids.length === 0) {
            this.userContainerRoleContainerPermissions = [];
            this.cdr.markForCheck();
            return;
        }

        this.subscriptions.add(this.UsersService.loadContainerPermissions(this.post.usercontainerroles._ids).subscribe((result) => {
            this.userContainerRoleContainerPermissions = result;
            this.cdr.markForCheck();
        }));
    }

    public onSelectedContainerIdsChange(event: any) {

        // Called when a container is selected or unselected
        if (this.selectedUserContainers.length === 0) {
            // No user containers selected
            this.selectedUserContainerWithPermission = [];
            this.cdr.markForCheck();
            return;
        }

        // Add new selected containers to the list
        this.selectedUserContainers.forEach(selectedContainerId => {
            const containerWithPermission = this.selectedUserContainerWithPermission.find(container => container.container_id === selectedContainerId);
            if (!containerWithPermission) {
                let permission_level: PermissionLevel = PermissionLevel.READ_RIGHT;
                if (selectedContainerId === ROOT_CONTAINER) {
                    // ROOT_CONTAINER is always read/write !
                    permission_level = PermissionLevel.WRITE_RIGHT;
                }

                this.selectedUserContainerWithPermission.push({
                    container_id: selectedContainerId,
                    container_name: this.getContainerName(selectedContainerId),
                    permission_level: permission_level
                });
            }
        });

        //Remove "unselected" containers
        const selectedUserContainerWithPermission: UserContainerPermission[] = [];

        this.selectedUserContainerWithPermission.forEach((container, index) => {
            if (this.selectedUserContainers.indexOf(container.container_id) !== -1) {
                // Container is still selected
                selectedUserContainerWithPermission.push(container);
            }
        });

        this.selectedUserContainerWithPermission = selectedUserContainerWithPermission;

        this.cdr.markForCheck();
    }

    private getContainerName(containerId: number): string {
        const container = this.containers.find(container => container.key === containerId);
        if (container) {
            return container.value;
        }
        return 'ERROR UNKNOWN CONTAINER';
    }

    public submit() {

        let ContainersUsersMemberships: { [key: number]: PermissionLevel } = {};
        this.selectedUserContainerWithPermission.forEach(container => {
            ContainersUsersMemberships[container.container_id] = container.permission_level;
        });
        this.post.ContainersUsersMemberships = ContainersUsersMemberships;

        if (this.post.is_oauth) {
            //oAuth 2 users don't have a password
            this.post.password = '';
            this.post.confirm_password = '';
        }

        this.subscriptions.add(this.UsersService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('User');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['users', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/users/index']);
                        return;
                    }
                    this.post = this.getDefaultPost();
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

    public loadUserDefaultTemplates() {

        let params: UserDefaultTemplatesParams = {
            angular: true,
            'ldapgroupIds[]': []
        }

        this.subscriptions.add(this.UsersService.loadUserDefaultTemplates(params).subscribe((result) => {
            this.userDefaultTemplates = result.userDefaultTemplates;
            this.userDefaultTemplateDetails = result.userDefaultTemplateDetails;
            this.cdr.markForCheck();
        }));
    }

    public onUserDefaultTemplateChange(event: MultiSelectChangeEvent) {
        let selectedUserDefaultTemplate = this.userDefaultTemplateDetails[event.value];
        this.post.usergroup_id = selectedUserDefaultTemplate.usergroup_id;
        this.post.container_id = selectedUserDefaultTemplate.container_id;
        this.post.is_oauth = selectedUserDefaultTemplate.is_oauth
        this.post.paginatorlength = selectedUserDefaultTemplate.paginatorlength;
        this.post.showstatsinmenu = selectedUserDefaultTemplate.showstatsinmenu;
        this.post.recursive_browser = selectedUserDefaultTemplate.recursive_browser;
        this.post.dashboard_tab_rotation = selectedUserDefaultTemplate.dashboard_tab_rotation;
        this.post.dateformat = selectedUserDefaultTemplate.dateformat;
        this.post.timezone = selectedUserDefaultTemplate.timezone;
        this.post.i18n = selectedUserDefaultTemplate.i18n;

        if (selectedUserDefaultTemplate.user_containers) {
            this.selectedUserContainers = selectedUserDefaultTemplate.user_containers._ids;
            for (let containerId in selectedUserDefaultTemplate.UserDefaultTemplatesToUserContainers) {
                this.selectedUserContainerWithPermission.push({
                    container_id: Number(containerId),
                    container_name: this.getContainerName(Number(containerId)),
                    permission_level: selectedUserDefaultTemplate.UserDefaultTemplatesToUserContainers[containerId]
                });
            }
            this.onSelectedContainerIdsChange(null);
        }
        this.cdr.markForCheck();
    }

    protected readonly PermissionLevel = PermissionLevel;
    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;
}
