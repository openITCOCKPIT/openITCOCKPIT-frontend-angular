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
import { AsyncPipe, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { ResourcegroupsSubmitType } from '../resourcegroups.enum';
import { MailinglistsService } from '../../mailinglists/mailinglists.service';

@Component({
    selector: 'oitc-resourcegroups-edit',
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
        NgIf,
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
        FormLoaderComponent,
        AsyncPipe,
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        InputGroupComponent,
        InputGroupTextDirective
    ],
    templateUrl: './resourcegroups-edit.component.html',
    styleUrl: './resourcegroups-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcegroupsEditComponent implements OnInit, OnDestroy {
    private id: number = 0;
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly ContainersService = inject(ContainersService);
    private readonly UsersService = inject(UsersService);
    private readonly MailinglistsService = inject(MailinglistsService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    public post!: ResourcegroupsPost;
    public createAnother: boolean = false;
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private ResourcegroupsService = inject(ResourcegroupsService);
    public containers: SelectKeyValue[] = [];

    public users: SelectKeyValue[] = [];
    public managers: SelectKeyValue[] = [];
    public region_managers: SelectKeyValue[] = [];

    public mailinglists_users: SelectKeyValue[] = [];
    public mailinglists_managers: SelectKeyValue[] = [];
    public mailinglists_region_managers: SelectKeyValue[] = [];

    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;
    private cdr = inject(ChangeDetectorRef);
    public errors: GenericValidationError | null = null;
    private router: Router = inject(Router);

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadResourcegroup();
    }

    public loadResourcegroup() {
        this.subscriptions.add(this.ResourcegroupsService.getEdit(this.id)
            .subscribe((result) => {
                //Fire on page load
                this.post = result.resourcegroup.Resourcegroup;
                this.cdr.markForCheck();
                this.loadContainers();
                this.loadUsers();
                this.loadMailinglists();
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


    public onContainerChange() {
        this.loadUsers();
        this.loadMailinglists();
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public getClearForm(): ResourcegroupsPost {
        return {
            description: '',
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
        this.subscriptions.add(this.ResourcegroupsService.edit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('Resource group');
                    const msg = this.TranslocoService.translate('updated successfully');
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

    protected readonly ResourcegroupsSubmitType = ResourcegroupsSubmitType;
}
