import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsercontainerrolesService } from '../usercontainerroles.service';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SelectedContainerWithPermission, UsercontainerrolesPost } from '../usercontainerroles.interface';
import { ContainersService } from '../../containers/containers.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { HistoryService } from '../../../history.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { ROOT_CONTAINER } from '../../changelogs/object-types.enum';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { ContainersLoadContainersByStringParams } from '../../containers/containers.interface';
import { NgIf } from '@angular/common';
import { DebounceDirective } from '../../../directives/debounce.directive';
import _, { parseInt } from 'lodash';
import { PermissionLevelString } from '../../users/permission-level';

@Component({
    selector: 'oitc-usercontainerroles-add',
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
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        MultiSelectComponent,
        CardFooterComponent,
        FormCheckInputDirective,
        BackButtonDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        MultiSelectComponent,
        PermissionDirective,
        RequiredIconComponent,
        XsButtonDirective,
        TranslocoPipe,
        RowComponent,
        ColComponent,
        FormCheckComponent,
        FormCheckLabelDirective,
        DebounceDirective,
        NgIf
    ],
    templateUrl: './usercontainerroles-add.component.html',
    styleUrl: './usercontainerroles-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsercontainerrolesAddComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly ContainersService = inject(ContainersService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    public post = this.getClearForm();
    public createAnother: boolean = false;
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private UsercontainerrolesService = inject(UsercontainerrolesService);
    public containers: SelectKeyValue[] = [];
    public selectedContainers: number[] = [];
    public selectedContainerWithPermission: SelectedContainerWithPermission[] = [];
    public ldapgroups: SelectKeyValue[] = [];
    public isLdapAuth: boolean = false;
    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;

    private cdr = inject(ChangeDetectorRef);
    public errors: GenericValidationError | null = null;

    public ngOnInit(): void {
        this.loadContainers();
        this.loadLdapGroups('');
    }

    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.cdr.markForCheck();
            }));
    }

    public loadLdapGroups = (searchString: string) => {
        this.subscriptions.add(this.UsercontainerrolesService.loadLdapGroups(searchString).subscribe((result) => {
            this.isLdapAuth = result.isLdapAuth;
            this.ldapgroups = result.ldapgroups;
            this.cdr.markForCheck();
        }));
    }

    public onContainerChange() {
        if (this.selectedContainers.length === 0) {
            this.post.ContainersUsercontainerrolesMemberships = {};
            this.selectedContainerWithPermission = [];
            return;
        }
        this.cleanUpContainersUsercontainerrolesMemberships();
        this.selectedContainers.forEach(containerId => {
            if (this.post.ContainersUsercontainerrolesMemberships[containerId] === undefined) {
                let permissionLevel = PermissionLevelString.READ_RIGHT;
                if (containerId === this.ROOT_CONTAINER) {
                    permissionLevel = PermissionLevelString.WRITE_RIGHT;
                }
                this.post.ContainersUsercontainerrolesMemberships[containerId] = permissionLevel;
            }
        });
        this.selectedContainerWithPermission = [];
        _.each(this.post.ContainersUsercontainerrolesMemberships, (value, key) => {
            let containerId = parseInt(key, 10);
            this.selectedContainerWithPermission.push({
                name: this.getContainerName(containerId),
                container_id: containerId,
                permission_level: value
            });
        });
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public getClearForm(): UsercontainerrolesPost {
        this.selectedContainers = [];
        this.selectedContainerWithPermission = [];
        return {
            name: '',
            ContainersUsercontainerrolesMemberships: {},
            ldapgroups: {
                _ids: []
            }
        }
    }

    public submit() {
        this.subscriptions.add(this.UsercontainerrolesService.createUsercontainerrole(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('User container role');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['usercontainerroles', 'edit', response.id];
                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/usercontainerroles/index']);
                        this.notyService.scrollContentDivToTop();
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

    private getContainerName(containerId: number) {
        for (let index in this.containers) {
            if (this.containers[index].key === containerId) {
                return this.containers[index].value;
            }
        }
        return this.TranslocoService.translate('RESTRICTED CONTAINER');
    }

    private cleanUpContainersUsercontainerrolesMemberships() {
        _.each(this.post.ContainersUsercontainerrolesMemberships, (value, key) => {
            let containerId = parseInt(key, 10);
            //Remove "unselected" containers
            if (this.selectedContainers.indexOf(containerId) === -1) {
                delete this.post.ContainersUsercontainerrolesMemberships[containerId];
            }
        });
        this.cdr.markForCheck();
    }

    protected readonly PermissionLevelString = PermissionLevelString;
}
