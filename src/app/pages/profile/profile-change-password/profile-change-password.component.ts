import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ProfilePasswordPost } from '../profile.interface';
import { GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ProfileService } from '../profile.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { NgIf } from '@angular/common';


@Component({
    selector: 'oitc-profile-change-password',
    standalone: true,
    imports: [
        TranslocoDirective,
        FormsModule,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        RowComponent,
        ColComponent,
        CardTitleDirective,
        FormDirective,
        FaIconComponent,
        FormLabelDirective,
        RequiredIconComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        CardFooterComponent,
        XsButtonDirective,
        BackButtonDirective,
        NgIf
    ],
    templateUrl: './profile-change-password.component.html',
    styleUrl: './profile-change-password.component.css'
})
export class ProfileChangePasswordComponent implements OnInit, OnDestroy {
    public PasswordPost: ProfilePasswordPost = {
        current_password: null,
        password: null,
        confirm_password: null
    };
    public PasswordErrors: GenericValidationError | null = null;

    private subscriptions: Subscription = new Subscription();

    private readonly ProfileService = inject(ProfileService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);

    @Input() public isLdapUser: boolean = false;

    public ngOnInit() {
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public submitPassword() {
        this.subscriptions.add(this.ProfileService.changePassword(this.PasswordPost)
            .subscribe((result) => {
                if (result.success) {
                    const msg = this.TranslocoService.translate('Password changed successfully.');
                    this.notyService.genericSuccess(msg);
                    this.PasswordPost = {
                        current_password: null,
                        password: null,
                        confirm_password: null
                    };
                    this.PasswordErrors = null;
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.PasswordErrors = errorResponse;
                }
            })
        );
    }
}
