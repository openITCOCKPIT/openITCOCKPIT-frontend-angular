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
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BackButtonDirective } from '../../../directives/back-button.directive';

import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';

import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';

import { SystemHealthUserEditGet, SystemHealthUserEditPost } from '../systemhealthusers.interface';
import { SystemHealthUsersService } from '../systemhealthusers.service';
import { Subscription } from 'rxjs';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { HistoryService } from '../../../history.service';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';

@Component({
    selector: 'oitc-system-health-users-edit',
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
    FormFeedbackComponent,
    BadgeComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    CardFooterComponent,
    FormLoaderComponent
],
    templateUrl: './system-health-users-edit.component.html',
    styleUrl: './system-health-users-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemHealthUsersEditComponent implements OnInit, OnDestroy {
    private readonly SystemHealthUsersService: SystemHealthUsersService = inject(SystemHealthUsersService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    protected errors: GenericValidationError | null = null;
    protected post: SystemHealthUserEditPost = {
        SystemHealthUser: {
            notify_on_critical: 0,
            notify_on_recovery: 0,
            notify_on_warning: 0
        },
        User: {
            email: '',
            firstname: '',
            lastname: ''
        },
        id: 0
    };
    private cdr = inject(ChangeDetectorRef);


    public submit() {
        this.subscriptions.add(this.SystemHealthUsersService.updateSystemHealthUser(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('System health Users');
                    const msg = this.TranslocoService.translate('saved successfully');
                    const url = ['/', 'systemHealthUsers', 'edit', this.post.id];

                    this.notyService.genericSuccess(msg, title, url);

                    this.HistoryService.navigateWithFallback(['/systemHealthUsers/index']);

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
        let id = Number(this.route.snapshot.paramMap.get('id'));
        //First

        this.subscriptions.add(this.SystemHealthUsersService.getEdit(id)
            .subscribe((result: SystemHealthUserEditGet) => {
                this.cdr.markForCheck();
                this.post = {
                    SystemHealthUser: result.systemHealthUser,
                    User: result.user,
                    id: id
                };
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
