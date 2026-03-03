import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BackButtonDirective } from '../../../directives/back-button.directive';

import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { LoadUsersRoot, SystemHealthUserAdd, User } from '../systemhealthusers.interface';
import { SystemHealthUsersService } from '../systemhealthusers.service';
import { Subscription } from 'rxjs';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-system-health-users-add',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        FormDirective,
        FormsModule,
        BackButtonDirective,
        FormLabelDirective,
        RequiredIconComponent,
        FormErrorDirective,
        FormFeedbackComponent,
        MultiSelectComponent,
        BadgeComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        CardFooterComponent
    ],
    templateUrl: './system-health-users-add.component.html',
    styleUrl: './system-health-users-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemHealthUsersAddComponent implements OnInit, OnDestroy {
    private readonly SystemHealthUsersService: SystemHealthUsersService = inject(SystemHealthUsersService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    protected errors: GenericValidationError | null = null;
    protected post: SystemHealthUserAdd = this.getClearForm();
    protected users: User[] = [];
    protected createAnother: boolean = false;
    private cdr = inject(ChangeDetectorRef);

    public getClearForm(): SystemHealthUserAdd {
        return {
            notify_on_critical: 1,
            notify_on_recovery: 1,
            notify_on_warning: 1,
            user_ids: []
        };
    }

    public submit() {
        this.subscriptions.add(this.SystemHealthUsersService.createSystemHealthUsers(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('System health Users');
                    const msg = this.TranslocoService.translate(' created successfully');
                    const url = ['/', 'systemHealthUsers', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/systemHealthUsers/index']);
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

    public ngOnInit() {
        this.loadUsers();
    }

    public loadUsers() {

        this.subscriptions.add(this.SystemHealthUsersService.loadUsers()
            .subscribe((result: LoadUsersRoot) => {
                this.users = result.users;
                this.cdr.markForCheck();
            })
        );
    }


    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
