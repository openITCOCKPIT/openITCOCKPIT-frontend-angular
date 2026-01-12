import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormLabelDirective,
    NavComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';

import { PermissionDirective } from '../../../permissions/permission.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../history.service';
import { UsercontainerrolesService } from '../usercontainerroles.service';
import { CopyUserContainerRoleDatum, CopyUserContainerRolesRequest } from '../usercontainerroles.interface';

@Component({
    selector: 'oitc-usercontainerroles-copy',
    imports: [
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    FormControlDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    NavComponent,
    PermissionDirective,
    ReactiveFormsModule,
    RequiredIconComponent,
    TranslocoDirective,
    XsButtonDirective,
    RouterLink,
    FormsModule,
    FormLoaderComponent
],
    templateUrl: './usercontainerroles-copy.component.html',
    styleUrl: './usercontainerroles-copy.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserContainerRolesCopyComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly UserContainerRolesService: UsercontainerrolesService = inject(UsercontainerrolesService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly cdr = inject(ChangeDetectorRef);

    protected userContainerRoles: CopyUserContainerRoleDatum[] = [];
    protected errors: GenericValidationError | null = null;

    public ngOnInit() {
        const ids = String(this.route.snapshot.paramMap.get('ids')).split(',').map(Number);

        if (!ids) {
            // No ids given
            this.router.navigate(['/', 'usercontainerroles', 'index']);
            return;
        }

        this.subscriptions.add(this.UserContainerRolesService.getCopy(ids).subscribe((userContainerRolesPost: CopyUserContainerRolesRequest) => {
            this.cdr.markForCheck();
            for (let userContainerRole of userContainerRolesPost.usercontainerroles) {
                this.userContainerRoles.push(
                    {
                        Source: {
                            id: userContainerRole.id,
                            name: userContainerRole.name
                        },
                        Usercontainerrole: {
                            name: userContainerRole.name
                        },
                        Error: null
                    }
                );
            }
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public copyUserContainerRoles() {
        this.subscriptions.add(
            this.UserContainerRolesService.saveCopy(this.userContainerRoles).subscribe({
                next: (value: any) => {
                    this.cdr.markForCheck();
                    this.notyService.genericSuccess();
                    this.HistoryService.navigateWithFallback(['/', 'usercontainerroles', 'index']);
                },
                error: (error: HttpErrorResponse) => {
                    this.cdr.markForCheck();
                    this.notyService.genericError();
                    this.userContainerRoles = error.error.result;
                }
            })
        );
    }
}
