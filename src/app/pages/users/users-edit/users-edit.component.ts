import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';
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
    FormSelectDirective,
    InputGroupComponent,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { OitcAlertComponent } from '../../../components/alert/alert.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { SliderTimeComponent } from '../../../components/slider-time/slider-time.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { UiBlockerComponent } from '../../../components/ui-blocker/ui-blocker.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    UserAddContainerRolePermission,
    UserContainerPermission,
    UserLocaleOption,
    UserPost,
    UsersLdapUserDetails,
    UserTimezonesSelect,
    UserType
} from '../users.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { SelectKeyValue, SelectKeyValueString } from '../../../layouts/primeng/select.interface';
import { LdapConfig } from '../../contacts/contacts.interface';
import { forkJoin, Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import _ from 'lodash';
import { PermissionsService } from '../../../permissions/permissions.service';
import { UsersService } from '../users.service';
import { ProfileService } from '../../profile/profile.service';
import { HistoryService } from '../../../history.service';
import { PermissionLevel } from '../permission-level';
import { ROOT_CONTAINER } from '../../changelogs/object-types.enum';
import { ContactsService } from '../../contacts/contacts.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';

@Component({
    selector: 'oitc-users-edit',
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
        NgIf,
        InputGroupComponent,
        NgClass,
        BadgeOutlineComponent,
        AsyncPipe,
        FormSelectDirective,
        OitcAlertComponent,
        UiBlockerComponent,
        TranslocoPipe,
        FormLoaderComponent
    ],
    templateUrl: './users-edit.component.html',
    styleUrl: './users-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersEditComponent implements OnInit, OnDestroy {
    public isLdapUser: boolean = false;
    public notPermittedContainerIds: number[] = [];
    public userContainerRolesReadonly: boolean = true;
    public userTypes: UserType[] = [];

    public post?: UserPost;
    public errors: GenericValidationError | null = null;

    public ldapUserDetails?: UsersLdapUserDetails;
    public ldapConfig?: LdapConfig;
    public usercontainerroles: SelectKeyValue[] = [];
    public usergroups: SelectKeyValue[] = [];
    public containers: SelectKeyValue[] = [];
    public containerIdsWithWritePermissions: number[] = [];
    public localeOptions: UserLocaleOption[] = [];
    public dateformats: SelectKeyValueString[] = [];
    public timezones: UserTimezonesSelect[] = [];
    public serverTime: string = '';
    public serverTimeZone: string = '';

    public selectedUserContainerRolesLdapReadOnly: number[] = [];
    public userContainerRoleContainerPermissionsLdap: UserAddContainerRolePermission[] = [];

    public selectedUserContainerRolesContainerIds: number[] = [];
    public selectedUserRoleThroughLdap: number = 0;

    public selectedUserContainers: number[] = [];
    public selectedUserContainerWithPermission: UserContainerPermission[] = [];
    public userContainerRoleContainerPermissions: UserAddContainerRolePermission[] = [];

    public readonly PermissionsService: PermissionsService = inject(PermissionsService);

    private subscriptions: Subscription = new Subscription();
    private readonly UsersService: UsersService = inject(UsersService);
    private readonly ProfileService: ProfileService = inject(ProfileService);
    private readonly ContactsService: ContactsService = inject(ContactsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadUser(id);

            this.loadUsergroups();
            this.loadDateformats();
            this.loadLocaleOptions();
        });

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadUser(id: number) {

        let requests = {
            container: this.UsersService.loadContainersForAngular(),
            user: this.UsersService.getUserEdit(id)
        };

        this.subscriptions.add(forkJoin(requests).subscribe(
            (results) => {
                // Store container data
                this.containers = results.container.containers;
                this.containerIdsWithWritePermissions = results.container.containerIdsWithWritePermissions;

                // Store user data
                this.post = results.user.user;
                this.post.password = '';
                this.post.confirm_password = '';
                this.isLdapUser = results.user.isLdapUser;
                this.userTypes = results.user.UserTypes;
                this.notPermittedContainerIds = results.user.notPermittedContainerIds; // User has not written permissions to all selected containers
                this.userContainerRolesReadonly = results.user.userContainerRolesReadonly; // User has not written permissions to all container roles or container roles via LDAP

                this.ldapUserDetails = undefined;
                this.selectedUserContainerWithPermission = [];
                this.selectedUserContainerRolesLdapReadOnly = [];
                this.userContainerRoleContainerPermissionsLdap = [];
                this.selectedUserRoleThroughLdap = 0;

                if (results.user.user.containers) {
                    //Reformat data that it looks like the same as it looks in the add method...

                    // Pre-select the container select element
                    this.selectedUserContainers = results.user.user.containers._ids;

                    for (let containerId in results.user.user.ContainersUsersMemberships) {
                        this.selectedUserContainerWithPermission.push({
                            container_id: Number(containerId),
                            container_name: this.getContainerName(Number(containerId)),
                            permission_level: results.user.user.ContainersUsersMemberships[containerId]
                        });
                    }

                    // Create the read/write list of containers
                    this.onSelectedContainerIdsChange(null);

                    // filter containers from the select box where the user has no permissions.
                    // this is to avoid PrimeNG showing empty options in the select.
                    // It is imporant to call onSelectedContainerIdsChange first - otherwise the container overview is empty.
                    if (this.notPermittedContainerIds.length > 0) {
                        // When notPermittedContainerIds is NOT empty, the select box is disabled.
                        // The value of selectedUserContainers is not send to the server anymore, so we can remove the
                        // not permitted container ids from selectedUserContainers without causing problems.
                        this.selectedUserContainers = this.selectedUserContainers.filter(containerId => {
                            return this.notPermittedContainerIds.indexOf(containerId) === -1;
                        });
                    }

                }

                if (results.user.isLdapUser) {
                    // Load container permissions based on LDAP groups
                    this.loadLdapConfig();

                    this.subscriptions.add(this.UsersService.loadLdapUserDetails(this.post.samaccountname).subscribe((result) => {
                        if (this.post) {
                            // Update values with current LDAP values
                            this.post.ldap_dn = result.dn;
                            this.post.firstname = result.givenname;
                            this.post.lastname = result.sn;
                            this.post.email = result.email;

                            this.ldapUserDetails = result;

                            this.selectedUserRoleThroughLdap = result.usergroupLdap.id || 0;

                            // Make sure the array is defined
                            if (!this.post.usercontainerroles_ldap) {
                                this.post.usercontainerroles_ldap = {
                                    _ids: []
                                };
                            }

                            const idsString = Object.keys(result.userContainerRoleContainerPermissionsLdap);
                            this.post.usercontainerroles_ldap._ids = idsString.map(Number);

                            // Mark container roles mapped through LDAP as selected
                            for (let i in result.userContainerRoleContainerPermissionsLdap) {
                                this.selectedUserContainerRolesLdapReadOnly.push(
                                    result.userContainerRoleContainerPermissionsLdap[i]._joinData.usercontainerrole_id
                                );
                            }

                            // Remove duplicates otherwise the PrimeNG will select the same item multiple times
                            this.selectedUserContainerRolesLdapReadOnly = _.uniq(this.selectedUserContainerRolesLdapReadOnly);

                            // Store permissions for the read / write radio buttons
                            this.userContainerRoleContainerPermissionsLdap = result.userContainerRoleContainerPermissionsLdapArray || [];

                            this.cdr.markForCheck();
                        }
                    }));
                }

                this.loadContainerRoles('');
                this.onUsercontainerrolesSelectChange(null);

                this.cdr.markForCheck();

            }));
    }

    public loadLdapConfig() {
        this.subscriptions.add(this.ContactsService.ldapConfiguration().subscribe((result) => {
            this.ldapConfig = result.ldapConfig;
            this.cdr.markForCheck();
        }));
    }

    public loadContainerRoles = (searchString: string): void => {
        if (!this.post) {
            console.log("ERROR: this.post is undefined - Can not load container roles");
            return;
        }

        let selected = this.post.usercontainerroles._ids;

        this.subscriptions.add(this.UsersService.loadUserContainerRoles(searchString, selected)
            .subscribe((result) => {
                this.usercontainerroles = result;
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
                if (this.post) {
                    this.post.apikeys = [...this.post.apikeys, result];
                    this.cdr.markForCheck();
                }
            })
        );
    }

    public removeApikey(index: number): void {
        if (this.post) {
            this.post.apikeys.splice(index, 1);
            this.cdr.markForCheck();
        }
    }

    public refreshApiKey(index: number): void {
        this.subscriptions.add(this.ProfileService.generateNewApiKey()
            .subscribe((result) => {
                if (this.post) {
                    this.post.apikeys[index].apikey = result.apikey;

                    // Get a new reference to trigger the change detection
                    this.post.apikeys = [...this.post.apikeys];

                    this.cdr.markForCheck();
                }
            })
        );
    }

    public onUsercontainerrolesSelectChange(event: any) {
        // Called when an usercontainerrole is selected or unselected
        if (this.post) {
            if (this.post.usercontainerroles._ids.length === 0) {
                this.userContainerRoleContainerPermissions = [];
                this.selectedUserContainerRolesContainerIds = [];
                this.cdr.markForCheck();
                return;
            }

            this.subscriptions.add(this.UsersService.loadContainerPermissions(this.post.usercontainerroles._ids).subscribe((result) => {
                this.userContainerRoleContainerPermissions = result;
                this.selectedUserContainerRolesContainerIds = result.map((item) => item.id);
                this.cdr.markForCheck();
            }));
        }
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
        return this.TranslocoService.translate('Hidden due to insufficient permissions');
    }

    public submit() {
        if (!this.post) {
            return;
        }

        let ContainersUsersMemberships: { [key: number]: PermissionLevel } = {};
        this.selectedUserContainerWithPermission.forEach(container => {
            ContainersUsersMemberships[container.container_id] = container.permission_level;
        });
        this.post.ContainersUsersMemberships = ContainersUsersMemberships;

        // LDAP and oAuth 2 users don't have a password
        if (this.isLdapUser || this.post.is_oauth) {
            this.post.password = '';
            this.post.confirm_password = '';
        }

        this.subscriptions.add(this.UsersService.saveUserEdit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('User');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['users', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/users/index']);
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

    protected readonly PermissionLevel = PermissionLevel;
    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;
}
