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
import { UsergroupsService } from '../usergroups.service';
import { UsergroupsAppend } from '../usergroups.interface';
import { Subscription } from 'rxjs';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { UsersService } from '../../users/users.service';


@Component({
    selector: 'oitc-usergroups-append',
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
    templateUrl: './usergroups-append.component.html',
    styleUrl: './usergroups-append.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsergroupsAppendComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly UsergroupsService: UsergroupsService = inject(UsergroupsService);
    private readonly UsersService: UsersService = inject(UsersService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    protected post: UsergroupsAppend = {
        Usergroup: {
            ldapgroups: {
                _ids: []
            },
            id: 0
        }
    };
    protected usergroups: SelectKeyValue[] = [];
    public errors: GenericValidationError | null = null;
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.loadUsergroups();
        this.cdr.markForCheck();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadUsergroups() {
        this.subscriptions.add(this.UsersService.loadUsergroups().subscribe((result) => {
            this.usergroups = result;
            this.cdr.markForCheck();
        }));
    }

    protected submit(): void {
        const ldapgroupIds = this.route.snapshot.paramMap.get('ldapgroupIds');
        if (ldapgroupIds) {
            this.post.Usergroup.ldapgroups._ids = ldapgroupIds.split(',').map(Number);
        }

        this.subscriptions.add(this.UsergroupsService.appendLdapgroups(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('Append LDAP groups to user role');
                    const msg = this.TranslocoService.translate(' successfully');
                    const url = ['usergroups', 'edit', response.id];

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
