import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective, FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ProfileService } from '../../profile/profile.service';
import { UserContainerRolesService } from '../user-container-roles.service';
import { HistoryService } from '../../../history.service';
import { UserContainerRole } from '../usercontainerroles.interface';
import { LoadLdapgroups } from '../../usergroups/usergroups.interface';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { NgForOf, NgIf } from '@angular/common';
import { ContainersLoadContainersByStringParams } from '../../containers/containers.interface';
import { ContainersService } from '../../containers/containers.service';

@Component({
    selector: 'oitc-usercontainerroles-add',
    standalone: true,
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        FormDirective,
        FormsModule,
        ReactiveFormsModule,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        BackButtonDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        MultiSelectComponent,
        RequiredIconComponent,
        ColComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        NgForOf,
        NgIf,
        RowComponent,
        CardFooterComponent,
        FormControlDirective
    ],
    templateUrl: './usercontainerroles-add.component.html',
    styleUrl: './usercontainerroles-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsercontainerrolesAddComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly UserContainerRolesService: UserContainerRolesService = inject(UserContainerRolesService);
    private readonly ContainersService: ContainersService = inject(ContainersService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly profileService: ProfileService = inject(ProfileService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected post: UserContainerRole = this.getDefaultPost();
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


    public addUserContainerRole(): void {
        this.subscriptions.add(this.UserContainerRolesService.addUserContainerRole(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    this.cdr.markForCheck();

                    const response: { usercontainerrole: GenericIdResponse } = result.data as { usercontainerrole: GenericIdResponse };

                    const title: string = this.TranslocoService.translate('User container role');
                    const msg: string = this.TranslocoService.translate('added successfully');
                    const url: (string | number)[] = ['usercontainerroles', 'edit', response.usercontainerrole.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/usercontainerroles/index']);
                        return;
                    }
                    this.post = this.getDefaultPost();
                    this.errors = {} as GenericValidationError;
                    this.selectedContainerIds = [];
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();
                    this.cdr.markForCheck();

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
        this.subscriptions.add(this.UserContainerRolesService.loadLdapgroupsForAngular(search).subscribe((ldapgroups: { ldapgroups: SelectKeyValue[] }) => {
            this.ldapGroups = ldapgroups.ldapgroups;
            this.cdr.markForCheck();
        }));
    }
}
