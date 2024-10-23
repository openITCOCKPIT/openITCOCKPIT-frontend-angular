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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ProfileService } from '../../profile/profile.service';
import { EditableUserContainerRole, UserContainerRole } from '../usercontainerroles.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { ContainersLoadContainersByStringParams } from '../../containers/containers.interface';
import { UserContainerRolesService } from '../user-container-roles.service';
import { ContainersService } from '../../containers/containers.service';
import { HistoryService } from '../../../history.service';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';

@Component({
    selector: 'oitc-usercontainerroles-edit',
    standalone: true,
    imports: [
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
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        RowComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        FormLoaderComponent
    ],
    templateUrl: './usercontainerroles-edit.component.html',
    styleUrl: './usercontainerroles-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsercontainerrolesEditComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly UserContainerRolesService: UserContainerRolesService = inject(UserContainerRolesService);
    private readonly ContainersService: ContainersService = inject(ContainersService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly profileService: ProfileService = inject(ProfileService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);

    protected post: EditableUserContainerRole = {
        id: 0,
        ldapgroups: {
            _ids: [] as number[]
        },
        name: '',
        ContainersUsercontainerrolesMemberships: {},
        containers: {
            _ids: [] as number[]
        }
    };
    protected errors: GenericValidationError = {} as GenericValidationError;
    protected ldapGroups: SelectKeyValue[] = [];
    protected selectedContainerIds: number[] = [];
    protected containers: SelectKeyValue[] = [];
    protected createAnother: boolean = false;

    private getDefaultPost(): UserContainerRole {
        return {
            name: '',
            ContainersUsercontainerrolesMemberships: {},
            ldapgroups: {
                _ids: []
            }
        };
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public ngOnInit() {

        const id = Number(this.route.snapshot.paramMap.get('id'));

        this.loadContainers();
        this.loadLdapGroups('');

        this.subscriptions.add(this.UserContainerRolesService.getEdit(id).subscribe((result: EditableUserContainerRole) => {
            this.cdr.markForCheck();
            this.post = result;
            this.selectedContainerIds = this.post.containers._ids;
        }));

    }

    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.cdr.markForCheck();
            }));
    }


    public updateUserContainerRole(): void {
        this.subscriptions.add(this.UserContainerRolesService.updateUserContainerRole(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    this.cdr.markForCheck();

                    const response: { usercontainerrole: GenericIdResponse } = result.data as {
                        usercontainerrole: GenericIdResponse
                    };

                    const title: string = this.TranslocoService.translate('User container role');
                    const msg: string = this.TranslocoService.translate('saved successfully');
                    const url: (string | number)[] = ['usercontainerroles', 'edit', response.usercontainerrole.id];

                    this.notyService.genericSuccess(msg, title, url);

                    this.HistoryService.navigateWithFallback(['/usercontainerroles/index']);
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


    public onSelectedContainerIdsChange() {
        // Traverse all containerids and set the value to 1.
        this.selectedContainerIds.map((id) => {
            if (id === 1) {
                this.post.ContainersUsercontainerrolesMemberships[id] = "2";
                return;
            }
            // Only if not already set to 1 or 2.
            if (this.post.ContainersUsercontainerrolesMemberships[id] !== "2") {
                this.post.ContainersUsercontainerrolesMemberships[id] = "1";
            }
        });
        this.cdr.markForCheck();
    }

    protected loadLdapGroups = (search: string = ''): void => {
        this.subscriptions.add(this.UserContainerRolesService.loadLdapgroupsForAngular(search).subscribe((ldapgroups: {
            ldapgroups: SelectKeyValue[]
        }) => {
            this.ldapGroups = ldapgroups.ldapgroups;
            this.cdr.markForCheck();
        }));
    }
}
