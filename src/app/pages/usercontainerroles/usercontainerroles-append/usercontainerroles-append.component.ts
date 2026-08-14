import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { HistoryService } from '../../../history.service';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { UsercontainerrolesService } from '../usercontainerroles.service';
import { UsercontainerrolesAppend } from '../usercontainerroles.interface';
import { Subscription } from 'rxjs';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { UsersService } from '../../users/users.service';


@Component({
    selector: 'oitc-usercontainerroles-append',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormDirective,
        FormLabelDirective,
        FormErrorDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        PaginatorModule,
        PermissionDirective,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        FormFeedbackComponent
    ],
    templateUrl: './usercontainerroles-append.component.html',
    styleUrl: './usercontainerroles-append.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsercontainerrolesAppendComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly UsercontainerrolesService: UsercontainerrolesService = inject(UsercontainerrolesService);
    private readonly UsersService: UsersService = inject(UsersService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    protected post: UsercontainerrolesAppend = {
        Usercontainerrole: {
            ldapgroups: {
                _ids: []
            },
            id: 0
        }
    };
    protected usercontainerroles: SelectKeyValue[] = [];
    public errors: GenericValidationError | null = null;
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.loadUsercontainerroles('');
        this.cdr.markForCheck();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    protected loadUsercontainerroles = (search: string) => {
        this.subscriptions.add(this.UsersService.loadUserContainerRoles(search)
            .subscribe((result) => {
                this.usercontainerroles = result;
                this.cdr.markForCheck();
            }));
    }

    protected submit(): void {
        const ldapgroupIds = this.route.snapshot.paramMap.get('ldapgroupIds');
        if (ldapgroupIds) {
            this.post.Usercontainerrole.ldapgroups._ids = ldapgroupIds.split(',').map(Number);
        }

        this.subscriptions.add(this.UsercontainerrolesService.appendLdapgroups(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('Append LDAP groups to user container role');
                    const msg = this.TranslocoService.translate(' successfully');
                    const url = ['usercontainerroles', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    this.notyService.scrollContentDivToTop();
                    this.HistoryService.navigateWithFallback(['/ldapgroups/index']);
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
