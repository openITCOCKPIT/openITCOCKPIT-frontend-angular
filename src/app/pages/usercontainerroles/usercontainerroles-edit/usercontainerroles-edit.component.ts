import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';


import { UsercontainerrolesService } from '../usercontainerroles.service';
import { SelectedContainerWithPermission, UsercontainerrolesPost } from '../usercontainerroles.interface';
import { ContainersService } from '../../containers/containers.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { HistoryService } from '../../../history.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { ROOT_CONTAINER } from '../../changelogs/object-types.enum';
import { ContainersLoadContainersByStringParams } from '../../containers/containers.interface';
import _, { parseInt } from 'lodash';
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
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';

import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { PermissionLevel } from '../../users/permission-level';

@Component({
    selector: 'oitc-usercontainerroles-edit',
    imports: [
    FormsModule,
    ReactiveFormsModule,
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
    MultiSelectComponent,
    NavComponent,
    NavItemComponent,
    PermissionDirective,
    RequiredIconComponent,
    RowComponent,
    TranslocoDirective,
    TranslocoPipe,
    XsButtonDirective,
    RouterLink,
    FormLoaderComponent
],
    templateUrl: './usercontainerroles-edit.component.html',
    styleUrl: './usercontainerroles-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsercontainerrolesEditComponent implements OnInit, OnDestroy {
    private id: number = 0;
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly ContainersService = inject(ContainersService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    public post!: UsercontainerrolesPost;
    public createAnother: boolean = false;
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private UsercontainerrolesService = inject(UsercontainerrolesService);
    public containers: SelectKeyValue[] = [];
    public selectedContainers: number[] = [];
    public notPermittedContainers: number[] = [];
    public selectedContainerWithPermission: SelectedContainerWithPermission[] = [];
    public ldapgroups: SelectKeyValue[] = [];
    public isLdapAuth: boolean = false;
    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;
    private cdr = inject(ChangeDetectorRef);
    public errors: GenericValidationError | null = null;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadContainers();
        this.loadLdapGroups('');
    }

    public loadUsercontainerrole() {
        this.subscriptions.add(this.UsercontainerrolesService.getEdit(this.id)
            .subscribe((result) => {
                //Fire on page load
                this.notPermittedContainers = [];
                this.post = result.usercontainerrole;
                if (result.usercontainerrole.containers?._ids) {
                    this.selectedContainers = result.usercontainerrole.containers._ids;
                    delete result.usercontainerrole.containers;
                }
                //Add new selected containers
                for (let containerId in this.post.ContainersUsercontainerrolesMemberships) {
                    let notPermittetCheck = this.containers.find(({key}) => key === parseInt(containerId, 10));
                    if (typeof notPermittetCheck === "undefined") {
                        this.notPermittedContainers.push(parseInt(containerId, 10));
                    }

                    this.selectedContainerWithPermission[parseInt(containerId, 10)] = {
                        name: this.getContainerName(parseInt(containerId, 10)),
                        container_id: parseInt(containerId, 10),
                        permission_level: this.post.ContainersUsercontainerrolesMemberships[containerId],
                        readonly: (typeof notPermittetCheck === "undefined")
                    };
                }
                if (this.notPermittedContainers.length > 0) {
                    //remove not permitted containers from selected containers
                    this.selectedContainers = _.difference(this.selectedContainers, this.notPermittedContainers);
                }
                this.cdr.markForCheck();

            }));
        this.cdr.markForCheck();
    }

    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.loadUsercontainerrole();
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
        if (this.selectedContainers.length === 0 && this.notPermittedContainers.length === 0) {
            this.post.ContainersUsercontainerrolesMemberships = {};
            this.selectedContainerWithPermission = [];
            return;
        }
        this.cleanUpContainersUsercontainerrolesMemberships();
        this.selectedContainers.forEach(containerId => {
            if (this.post.ContainersUsercontainerrolesMemberships[containerId] === undefined) {
                let permissionLevel = PermissionLevel.READ_RIGHT;
                if (containerId === this.ROOT_CONTAINER) {
                    permissionLevel = PermissionLevel.WRITE_RIGHT;
                }
                this.post.ContainersUsercontainerrolesMemberships[containerId] = permissionLevel;
            }
        });
        this.selectedContainerWithPermission = [];
        _.each(this.post.ContainersUsercontainerrolesMemberships, (value, key) => {
            let containerId = parseInt(key, 10);
            let notPermittetCheck = this.containers.find(({key}) => key === containerId);
            this.selectedContainerWithPermission.push({
                name: this.getContainerName(containerId),
                container_id: containerId,
                permission_level: value,
                readonly: (typeof notPermittetCheck === "undefined")
            });
        });
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public submit() {
        this.subscriptions.add(this.UsercontainerrolesService.edit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('User container role');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['usercontainerroles', 'edit', response.id];
                    this.notyService.genericSuccess(msg, title, url);


                    this.HistoryService.navigateWithFallback(['/usercontainerroles/index']);
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
            //Remove "unselected" containers, consider not permitted containers too
            if (this.selectedContainers.indexOf(containerId) === -1 && this.notPermittedContainers.indexOf(containerId) === -1) {
                delete this.post.ContainersUsercontainerrolesMemberships[containerId];
            }
        });
        this.cdr.markForCheck();
    }

    protected readonly PermissionLevel = PermissionLevel;
}
