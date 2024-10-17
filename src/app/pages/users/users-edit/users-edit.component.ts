import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    AlertComponent,
    AlertHeadingDirective,
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
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ProfileService } from '../../profile/profile.service';
import { ContactsService } from '../../contacts/contacts.service';
import {
    EditUserGet,
    LdapUser,
    LdapUserDetails,
    LoadContainerPermissionsRequest,
    LoadContainerPermissionsRoot,
    LoadContainerRolesRequest,
    LoadContainerRolesRoot,
    LoadContainersResponse,
    LoadLdapUserByStringRoot,
    LoadLdapUserDetailsRoot,
    LoadUsergroupsRoot,
    UpdateUser,
    UserDateformat,
    UserDateformatsRoot,
    UserLocaleOption,
    UserTimezonesSelect,
    UserType
} from '../users.interface';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { LdapConfig } from '../../contacts/contacts.interface';
import { ContainersLoadContainersByStringParams } from '../../containers/containers.interface';
import { UsersService } from '../users.service';
import { ContainersService } from '../../containers/containers.service';
import { HistoryService } from '../../../history.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { KeyFilterModule } from 'primeng/keyfilter';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';

@Component({
    selector: 'oitc-users-edit',
    standalone: true,
    imports: [
        AlertComponent,
        AlertHeadingDirective,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,

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
        InputGroupComponent,
        KeyValuePipe,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NgOptionTemplateDirective,
        NgSelectComponent,
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        RowComponent,
        SelectComponent,
        TranslocoDirective,
        TrueFalseDirective,
        XsButtonDirective,
        RouterLink,
        NgOptionHighlightDirective,
        FormLoaderComponent,
        KeyFilterModule,
        BadgeOutlineComponent
    ],
    templateUrl: './users-edit.component.html',
    styleUrl: './users-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersEditComponent implements OnDestroy, OnInit {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly UsersService: UsersService = inject(UsersService);
    private readonly ContainersService: ContainersService = inject(ContainersService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly profileService: ProfileService = inject(ProfileService);
    private readonly ContactService: ContactsService = inject(ContactsService);
    private readonly route = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    protected createAnother: boolean = false;
    protected post: UpdateUser = this.getDefaultPost();
    protected containerRoles: LoadContainerRolesRoot = {} as LoadContainerRolesRoot;
    protected selectedContainerIds: number[] = [];
    protected containers: SelectKeyValue[] = [];
    protected dateformats: UserDateformat[] = [];
    protected timezones: UserTimezonesSelect[] = [];
    protected localeOptions: UserLocaleOption[] = [];
    protected usergroups: SelectKeyValue[] = [];
    protected errors: GenericValidationError = {} as GenericValidationError;
    protected containerPermissions: LoadContainerPermissionsRoot = {} as LoadContainerPermissionsRoot;
    protected containerRoleContainerIds: number[] = [];
    protected tabRotationIntervalText: string = '';
    protected samaccountnames: LdapUser[] = [];
    protected ldapConfig: LdapConfig = {} as LdapConfig;
    protected serverTime: string = '';
    protected serverTimeZone: string = '';
    protected isLdapUser: boolean = false;
    protected notPermittedContainerIds: number[] = [];

    public onSelectedContainerIdsChange() {
        // Traverse all containerids and set the value to 1.
        this.selectedContainerIds.map((id) => {

            if (id === 1) {
                this.post.User.ContainersUsersMemberships[id] = 2;
                return;
            }

            let value = parseInt(this.post.User.ContainersUsersMemberships[id] as unknown as string);
            if (isNaN(value)) {
                console.info("Fallback to 1.");
                this.post.User.ContainersUsersMemberships[id] = 1;
                return;
            }
            this.post.User.ContainersUsersMemberships[id] = value;
        });
        this.cdr.markForCheck();
    }

    public updateUser(): void {
        this.subscriptions.add(this.UsersService.updateUser(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response: {user: GenericIdResponse} = result.data as {user: GenericIdResponse};
                    const title: string = this.TranslocoService.translate('User');
                    const msg: string = this.TranslocoService.translate('updated successfully');
                    const url: (string | number)[] = ['users', 'edit', response.user.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/users/index']);
                        return;
                    }
                    this.errors = {} as GenericValidationError;

                    this.ldapUserDetails = {
                        usergroupLdap: {
                            id: 0
                        }
                    } as LdapUserDetails;
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();

                    return;
                }

                // Error
                this.notyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;

                    console.warn(this.errors);
                }
            })
        );
    }

    private getDefaultPost(): UpdateUser {
        // Build a blank instance of AddFromLdapRoot including all nested objects.
        return {
            User: {
                id: 0,
                containers: {
                    _ids: []
                },
                usercontainerroles_containerids: {
                    _ids: []
                },
// USER FIELDS
                apikeys: [],
                company: '',
                confirm_password: '',
                ContainersUsersMemberships: {},
                dashboard_tab_rotation: 0,
                dateformat: 'H:i:s - d.m.Y',
                email: '',
                firstname: '',
                i18n: 'en_US',
                is_active: 1,
                is_oauth: 0,
                lastname: '',
                paginatorlength: 25,
                password: '',
                phone: '',
                position: '',
                recursive_browser: 0,
                showstatsinmenu: 0,
                timezone: 'Europe/Berlin',
                usercontainerroles: {
                    _ids: []
                },
                usergroup_id: 0,
//  ADDITIONAL LDAP FIELDS
                ldap_dn: '',
                samaccountname: '',
                usercontainerroles_ldap: {
                    _ids: []
                }
            }
        }
    }

    public ngOnInit() {
        this.loadContainers();
        this.updateTabRotationInterval();
        this.loadDateformats();
        this.loadLocaleOptions();
        this.loadContainerRoles('');
        this.loadUsergroups();
        this.loadLdapConfig();
        this.loadEditUser();
    }

    protected UserType: UserType = {} as UserType;

    private loadEditUser(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.UsersService.getEdit(id)
            .subscribe((result: EditUserGet) => {
                this.cdr.markForCheck();
                this.post.User = result.user;
                this.UserType = result.UserTypes[0];
                // Add empty passwords field, otherwise they are undefined.
                this.post.User.password = '';
                this.post.User.confirm_password = '';

                // Put the containerIds into this.selectedContainerIds.
                this.selectedContainerIds = this.post.User.containers._ids;
                this.onSelectedContainerIdsChange();
                this.onContainerRolesChange(null);

                this.isLdapUser = result.isLdapUser;
                if (this.isLdapUser) {
                    this.loadLdapUsers('');
                }
                this.notPermittedContainerIds = result.notPermittedContainerIds;

                // Clear those ContainerRoleIds that are not available for the user and would cause an empty böbbel in the oitc-multi select.
                let selectedContainerRoleIds = new Set(this.containers.map(item => item.key));
                this.invisibleContainerRoleIds = this.post.User.usercontainerroles._ids.filter(key => !selectedContainerRoleIds.has(key));
                // this.post.User.usercontainerroles._ids = this.post.User.usercontainerroles._ids.filter(key => selectedContainerRoleIds.has(key));

                // Force the update of the rotation slider's text.
                this.updateTabRotationInterval()
            }));
        this.selectedContainerIds = [];
        this.containerPermissions = {} as LoadContainerPermissionsRoot;
        this.containerRoles = {} as LoadContainerRolesRoot;
    }

    protected invisibleContainerRoleIds: number[] = [];

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadContainerRoles = (query: string): void => {
        let params: LoadContainerRolesRequest = {
            'filter[Usercontainerroles.name]': query,
            selected: this.post.User.usercontainerroles._ids,
            angular: true
        }
        this.subscriptions.add(this.UsersService.loadContainerRoles(params)
            .subscribe((result: LoadContainerRolesRoot) => {
                this.containerRoles = result;
                this.cdr.markForCheck();
            }));
    }

    protected onContainerRolesChange = (event: any): void => {
        this.loadContainerRolesPermissions();
    }

    protected loadContainerRolesPermissions = (): void => {
        // For each containerPermissions object attach the containerId to this.containerRoleContainerIds.
        this.containerRoleContainerIds = [];
        this.containerPermissions = {} as LoadContainerPermissionsRoot;

        let params: LoadContainerPermissionsRequest = {
            'usercontainerRoleIds[]': this.post.User.usercontainerroles._ids,
            angular: true
        }
        this.subscriptions.add(this.UsersService.loadContainerPermissions(params)
            .subscribe((result: LoadContainerPermissionsRoot) => {
                this.cdr.markForCheck();
                this.containerPermissions = result;

                // Traverse this.containerPermissions.userContainerRoleContainerPermissions and append the containerPermission.container_id to this.containerRoleContainerIds.
                Object.keys(this.containerPermissions.userContainerRoleContainerPermissions).forEach((key) => {
                    this.containerRoleContainerIds.push(this.containerPermissions.userContainerRoleContainerPermissions[key].id);
                });
            }));
    }
    public loadContainers = (): void => {
        this.subscriptions.add(this.UsersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: LoadContainersResponse) => {
                this.cdr.markForCheck();
                this.containers = result.containers;
                this.containerIdsWithWritePermissions = result.containerIdsWithWritePermissions;
            }));
    }

    protected containerIdsWithWritePermissions: number[] = [];

    public loadDateformats = (): void => {
        this.subscriptions.add(this.UsersService.getDateformats()
            .subscribe((result: UserDateformatsRoot) => {
                this.cdr.markForCheck();
                this.dateformats = result.dateformats;
                this.timezones = result.timezones;

                this.serverTimeZone = result.serverTimeZone;
                this.serverTime = result.serverTime;
            }));
    }

    public loadLocaleOptions = (): void => {
        this.subscriptions.add(this.UsersService.getLocaleOptions()
            .subscribe((result: UserLocaleOption[]) => {
                this.localeOptions = result;
                this.cdr.markForCheck();
            }));
    }

    private loadUsergroups(): void {
        this.subscriptions.add(this.UsersService.getUsergroups()
            .subscribe((result: LoadUsergroupsRoot) => {
                this.usergroups = result.usergroups;
                this.cdr.markForCheck();
            }))
    }

    protected loadLdapUsers = (search: string): void => {
        this.subscriptions.add(this.UsersService.loadLdapUserByString(search)
            .subscribe((result: LoadLdapUserByStringRoot) => {
                this.samaccountnames = result.ldapUsers;
                this.cdr.markForCheck();
            }))
    }

    protected ldapUserDetails: LdapUserDetails = {
        usergroupLdap: {
            id: 0
        }
    } as LdapUserDetails;

    private loadLdapUserDetails(): void {
        this.subscriptions.add(this.UsersService.loadLdapUserDetails(this.post.User.samaccountname)
            .subscribe((result: LoadLdapUserDetailsRoot) => {
                this.cdr.markForCheck();
                this.ldapUserDetails = result.ldapUser;

                this.ldapUserDetails.ldapgroupIds = this.ldapUserDetails.ldapgroups.map((entry) => {
                    return entry.id;
                });

                // SET NAME AND EMAIL
                this.post.User.firstname = this.ldapUserDetails.givenname;
                this.post.User.lastname = this.ldapUserDetails.sn;
                this.post.User.email = this.ldapUserDetails.email;

                // From every object of this.ldapUserDetails.userContainerRoleContainerPermissionsLdap, take every key of object user_roles and attach it to this.post.User.usercontainerroles_ldap._ids.
                this.post.User.usercontainerroles_ldap._ids = [];
                Object.keys(this.ldapUserDetails.userContainerRoleContainerPermissionsLdap).forEach(key => {
                    const userRoles = this.ldapUserDetails.userContainerRoleContainerPermissionsLdap[key].user_roles;
                    const roleIds = Object.keys(userRoles).map(Number);

                    // Only add the roleIds if they are not already in the array.
                    roleIds.forEach((roleId) => {
                        if (this.post.User.usercontainerroles_ldap._ids.indexOf(roleId) === -1) {
                            this.post.User.usercontainerroles_ldap._ids.push(roleId);
                        }
                    });
                });
            }))
    }

    protected onLdapUserChange(event: any): void {
        this.cdr.markForCheck();
        // Fetch the entries from this.ldapUsers that matches this.samaccountname.
        let ldapUser = this.samaccountnames.find((entry) => {
            return entry.samaccountname === this.post.User.samaccountname;
        });
        // Earlyreturn if ldapUser is undefined.
        if (ldapUser === undefined) {
            return;
        }
        this.post.User.ldap_dn = ldapUser.dn;
        this.loadLdapUserDetails();
    }

    protected createApiKey(): void {
        this.subscriptions.add(this.profileService.generateNewApiKey()
            .subscribe((result) => {
                this.post.User.apikeys.push(result);
                this.cdr.markForCheck();
            })
        );
    }

    private loadLdapConfig(): void {
        this.subscriptions.add(this.ContactService.ldapConfiguration()
            .subscribe((result) => {
                this.ldapConfig = result.ldapConfig;
                this.cdr.markForCheck();
            }))
    }

    protected updateTabRotationInterval(): void {
        this.cdr.markForCheck();

        if (this.post.User.dashboard_tab_rotation === 0) {
            this.tabRotationIntervalText = 'disabled';
            return;
        }
        let min = Math.floor(this.post.User.dashboard_tab_rotation / 60),
            sec = Math.round(this.post.User.dashboard_tab_rotation % 60);
        if (min > 0) {
            this.tabRotationIntervalText = min + ' minutes, ' + sec + ' seconds';
            return;
        }
        this.tabRotationIntervalText = sec + ' seconds';
    }

    protected deleteApiKey(index: number): void {
        this.post.User.apikeys.splice(index, 1);
        this.cdr.markForCheck();
    }

    protected refreshApiKey(index: number): void {
        this.subscriptions.add(this.profileService.generateNewApiKey()
            .subscribe((result) => {
                this.post.User.apikeys[index].apikey = result.apikey;
                this.cdr.markForCheck();
            })
        );
    }

    protected trackByIndex(index: number, item: any): number {
        return index;
    }

}

