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
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { UserDefaultTemplatesPost, } from '../user-default-templates.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { SelectKeyValue, SelectKeyValueString } from '../../../layouts/primeng/select.interface';
import { forkJoin, Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';

@Component({
    selector: 'oitc-user-default-templates-edit',
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
        FormLoaderComponent
    ],
    templateUrl: './user-default-templates-edit.component.html',
    styleUrl: './user-default-templates-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDefaultTemplatesEditComponent implements OnInit, OnDestroy {

    public notPermittedContainerIds: number[] = [];
    public containerIdsWithWritePermissions: number[] = [];

    public post?: UserDefaultTemplatesPost;
    public errors: GenericValidationError | null = null;

    public usergroups: SelectKeyValue[] = [];
    public containers: SelectKeyValue[] = [];
    public localeOptions: UserLocaleOption[] = [];
    public dateformats: SelectKeyValueString[] = [];
    public timezones: UserTimezonesSelect[] = [];
    public serverTime: string = '';
    public serverTimeZone: string = '';

    public selectedUserContainers: number[] = [];
    public selectedUserContainerWithPermission: UserContainerPermission[] = [];
    protected ldapGroups: SelectKeyValue[] = [];

    public readonly PermissionsService: PermissionsService = inject(PermissionsService);

    private subscriptions: Subscription = new Subscription();
    private readonly UsersService: UsersService = inject(UsersService);
    private readonly UserDefaultTemplatesService: UserDefaultTemplatesService = inject(UserDefaultTemplatesService);
    private readonly UsergroupsService: UsergroupsService = inject(UsergroupsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadUserDefaultTemplate(id);
            this.loadUsergroups();
            this.loadDateformats();
            this.loadLocaleOptions();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadUserDefaultTemplate(id: number) {

        let requests = {
            container: this.UsersService.loadContainersForAngular(),
            userdefaulttemplate: this.UserDefaultTemplatesService.getUserDefaultTemplatesEdit(id)
        };

        this.subscriptions.add(forkJoin(requests).subscribe(
            (results) => {
                // Store container data
                this.containers = results.container.containers;
                this.containerIdsWithWritePermissions = results.container.containerIdsWithWritePermissions;

                // Store user data
                this.post = results.userdefaulttemplate.userDefaultTemplate;
                this.notPermittedContainerIds = results.userdefaulttemplate.notPermittedContainerIds; // User has not written permissions to all selected containers

                this.selectedUserContainerWithPermission = [];

                if (results.userdefaulttemplate.userDefaultTemplate.containers) {
                    //Reformat data that it looks like the same as it looks in the add method...

                    // Pre-select the container select element
                    this.selectedUserContainers = results.userdefaulttemplate.userDefaultTemplate.containers._ids;

                    for (let containerId in results.userdefaulttemplate.userDefaultTemplate.UserDefaultTemplatesToContainers) {
                        this.selectedUserContainerWithPermission.push({
                            container_id: Number(containerId),
                            container_name: this.getContainerName(Number(containerId)),
                            permission_level: results.userdefaulttemplate.userDefaultTemplate.UserDefaultTemplatesToContainers[containerId]
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

                this.loadLdapGroups('');

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
        if (!this.post) {
            return;
        }

        let ContainersUserDefaultTemplatesMemberships: { [key: number]: PermissionLevel } = {};
        this.selectedUserContainerWithPermission.forEach(container => {
            ContainersUserDefaultTemplatesMemberships[container.container_id] = container.permission_level;
        });
        this.post.UserDefaultTemplatesToContainers = ContainersUserDefaultTemplatesMemberships;

        this.subscriptions.add(this.UserDefaultTemplatesService.saveUserDefaultTemplatesEdit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('User Default Template');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['userDefaultTemplates', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/userDefaultTemplates/index']);
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

    protected loadLdapGroups = (search: string = '') => {
        let selected: number[] = [];
        if (this.post && this.post.ldapgroups && this.post.ldapgroups._ids) {
            selected = this.post.ldapgroups._ids;
        }
        this.subscriptions.add(this.UsergroupsService.loadLdapgroupsForAngular(search, selected).subscribe((ldapgroups: LoadLdapgroups) => {
            this.ldapGroups = ldapgroups.ldapgroups;
            this.cdr.markForCheck();
        }));
    }

    protected readonly PermissionLevel = PermissionLevel;
    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;
}
