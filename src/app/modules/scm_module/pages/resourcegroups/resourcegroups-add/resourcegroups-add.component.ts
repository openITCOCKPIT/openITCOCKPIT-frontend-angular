import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent, CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective, FormCheckInputDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
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
        FormCheckInputDirective
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
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    public post = this.getClearForm();
    public createAnother: boolean = false;
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private ResourcegroupsService = inject(ResourcegroupsService);
    public containers: SelectKeyValue[] = [];
    public users: SelectKeyValue[] = [];
    public managers: SelectKeyValue[] = [];
    public region_managers: SelectKeyValue[] = [];
    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;
    private cdr = inject(ChangeDetectorRef);
    public errors: GenericValidationError | null = null;


    public ngOnInit(): void {
        this.loadContainers();
    }

    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.cdr.markForCheck();
            }));
    }

    private loadUsers() {
        if(this.post.container.parent_id === null){
            return;
        }
        this.subscriptions.add(this.UsersService.loadUsersByContainerId(this.post.container.parent_id, []).subscribe((result) => {
            this.users = result;
            this.managers = result;
            this.region_managers = result;
            this.cdr.markForCheck();
        }));
    }


    public onContainerChange() {
        this.loadUsers();
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
            }
        }
    }

    public submit() {
        this.subscriptions.add(this.ResourcegroupsService.createResourcegroup(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('Resource group');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['scm_module', 'resourcegroups', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/scm_module/resourcegroups/index']);
                        this.notyService.scrollContentDivToTop();
                        return;
                    }

                    // Create another
                    this.post = this.getClearForm();
                    this.errors = null;
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();

                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            })
        );
    }
}
