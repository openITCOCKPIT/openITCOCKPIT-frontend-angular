import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
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
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { UsercontainerrolesByLdapGroup, UserDefaultTemplatesPost, } from '../user-default-templates.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { SelectKeyValue, SelectKeyValueString } from '../../../layouts/primeng/select.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { RouterLink } from '@angular/router';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { PermissionsService } from '../../../permissions/permissions.service';
import { UsersService } from '../../users/users.service';
import { UsergroupsService } from '../../usergroups/usergroups.service';
import { HistoryService } from '../../../history.service';
import { PermissionLevel } from '../../users/permission-level';
import { ROOT_CONTAINER } from '../../changelogs/object-types.enum';
import { UserDefaultTemplatesService } from '../user-default-templates.service';
import { LoadLdapgroups } from '../../usergroups/usergroups.interface';
import { SliderTimeComponent } from '../../../components/slider-time/slider-time.component';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { UserContainerPermission, UserLocaleOption, UserTimezonesSelect } from '../../users/users.interface';
import { ContainersService } from '../../containers/containers.service';
import { OitcAlertComponent } from '../../../components/alert/alert.component';
import { NgClass } from '@angular/common';

@Component({
    selector: 'oitc-user-default-templates-add',
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
        FormControlDirective,
        NgOptionTemplateDirective,
        NgSelectComponent,
        NgOptionHighlightDirective,
        RowComponent,
        ColComponent,
        SliderTimeComponent,
        TrueFalseDirective,
        OitcAlertComponent,
        ContainerComponent,
        TranslocoPipe,
        NgClass
    ],
    templateUrl: './user-default-templates-add.component.html',
    styleUrl: './user-default-templates-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDefaultTemplatesAddComponent implements OnInit, OnDestroy {
    public createAnother: boolean = false;
    public post: UserDefaultTemplatesPost = this.getDefaultPost();
    public errors: GenericValidationError | null = null;

    public usergroups: SelectKeyValue[] = [];
    public filteredContainersByContainerIds: SelectKeyValue[] = [];
    public localeOptions: UserLocaleOption[] = [];
    public dateformats: SelectKeyValueString[] = [];
    public timezones: UserTimezonesSelect[] = [];
    public serverTime: string = '';
    public serverTimeZone: string = '';

    protected ldapGroups: SelectKeyValue[] = [];


    public containers: SelectKeyValue[] = [];
    public usercontainerrolesByLdapGroup: UsercontainerrolesByLdapGroup[] = [];

    public selectedUserContainerWithPermission: UserContainerPermission[] = [];


    public readonly PermissionsService: PermissionsService = inject(PermissionsService);

    private subscriptions: Subscription = new Subscription();
    private readonly UsersService: UsersService = inject(UsersService);
    private readonly UserDefaultTemplatesService: UserDefaultTemplatesService = inject(UserDefaultTemplatesService);
    private readonly UsergroupsService: UsergroupsService = inject(UsergroupsService);
    private readonly ContainersService = inject(ContainersService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.loadLdapGroups('');
        this.loadContainers();
        this.loadUsergroups();
        this.loadDateformats();
        this.loadLocaleOptions();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getDefaultPost(): UserDefaultTemplatesPost {
        this.selectedUserContainerWithPermission = [];

        return {
            name: '',
            description: '',
            showstatsinmenu: 0,
            paginatorlength: 25,
            dashboard_tab_rotation: 0,
            recursive_browser: 0,
            dateformat: 'H:i:s - d.m.Y',
            timezone: 'Europe/Berlin',
            i18n: 'en_US',
            is_oauth: false,
            usergroup_id: 0,
            UserDefaultTemplatesToUserContainers: {},
            ldapgroups: {
                _ids: []
            },
            containers: {
                _ids: []
            },
            usercontainers: {
                _ids: []
            },
            ContainersUsersMemberships: {},
        };
    }

    private loadContainers(): void {
        this.subscriptions.add(this.UsersService.loadContainersForAngular().subscribe((result) => {
            this.containers = result.containers;
            this.cdr.markForCheck();
        }));
    }

    public loadContainersByContainerIds(containerIds: number[]) {
        this.subscriptions.add(this.ContainersService.loadContainersByContainerIds(containerIds).subscribe((result) => {
            this.filteredContainersByContainerIds = result.containers;
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

    protected loadLdapGroups = (search: string = '') => {
        let selected: number[] = [];
        if (this.post && this.post.ldapgroups && this.post.ldapgroups._ids) {
            selected = this.post.ldapgroups._ids;
        }
        this.subscriptions.add(this.UserDefaultTemplatesService.loadLdapgroupsForAngular(search, selected).subscribe((ldapgroups: LoadLdapgroups) => {
            this.ldapGroups = ldapgroups.ldapgroups;
            this.cdr.markForCheck();
        }));
    }


    private getContainerName(containerId: number): string {
        const container = this.filteredContainersByContainerIds.find(container => container.key === containerId);
        if (container) {
            return container.value;
        }
        return 'ERROR UNKNOWN CONTAINER';
    }

    public submit() {
        let ContainersUserDefaultTemplatesMemberships: { [key: number]: PermissionLevel } = {};
        this.selectedUserContainerWithPermission.forEach(container => {
            ContainersUserDefaultTemplatesMemberships[container.container_id] = container.permission_level;
        });
        this.post.UserDefaultTemplatesToUserContainers = ContainersUserDefaultTemplatesMemberships;

        this.subscriptions.add(this.UserDefaultTemplatesService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('User Default Template');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['userDefaultTemplates', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/userDefaultTemplates/index']);
                        return;
                    }
                    this.post = this.getDefaultPost();
                    this.loadLdapGroups('');
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

    public onContainerChange(): void {
        this.loadContainersByContainerIds(this.post.containers._ids);
    }

    public onLdapGroupsChange(): void {
        this.loadLdapGroupRoles('');
    }

    public loadLdapGroupRoles = (searchString: string): void => {
        if (!this.post) {
            return;
        }
        let ldapGroupIds = this.post.ldapgroups._ids;

        this.subscriptions.add(this.UserDefaultTemplatesService.loadUserContainerRolesByLdapGroupIds(searchString, ldapGroupIds)
            .subscribe((result) => {
                this.usercontainerrolesByLdapGroup = result;
                this.cdr.markForCheck();
            }));
    }

    public onSelectedContainerIdsChange(values: number[]) {
        // Called when a container is selected or unselected
        if (this.post.usercontainers._ids.length === 0) {
            // No user containers selected
            this.selectedUserContainerWithPermission = [];
            this.cdr.markForCheck();
            return;
        }

        // Add new selected containers to the list
        this.post.usercontainers._ids.forEach(selectedContainerId => {
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
            if (this.post.usercontainers._ids.indexOf(container.container_id) !== -1) {
                // Container is still selected
                selectedUserContainerWithPermission.push(container);
            }
        });

        this.selectedUserContainerWithPermission = selectedUserContainerWithPermission;

        this.cdr.markForCheck();
    }

    protected readonly PermissionLevel = PermissionLevel;
    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;
}
