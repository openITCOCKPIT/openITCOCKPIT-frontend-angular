import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { GenericValidationError } from '../../../generic-responses';
import { ProfileUser } from '../profile.interface';
import { NgForOf, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ProfileService } from '../profile.service';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { UsersService } from '../../users/users.service';
import { UserDateformat, UserLocaleOption, UserTimezonesSelect } from '../../users/users.interface';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { TimezoneConfiguration, TimezoneService } from '../../../services/timezone.service';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BackButtonDirective } from '../../../directives/back-button.directive';

@Component({
    selector: 'oitc-profile-edit',
    standalone: true,
    imports: [
        CoreuiComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        CardBodyComponent,
        CardFooterComponent,
        RouterLink,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        NgIf,
        FormsModule,
        DebounceDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        TrueFalseDirective,
        NgForOf,
        NgSelectModule,
        NgOptionHighlightModule,
        FormDirective,
        XsButtonDirective,
        BackButtonDirective
    ],
    templateUrl: './profile-edit.component.html',
    styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent implements OnInit, OnDestroy {

    public UserErrors: GenericValidationError | null = null;
    public UserPost: ProfileUser | null = null;
    public isLdapUser: boolean = false;
    public localeOptions: UserLocaleOption[] = [];
    public dateformates: UserDateformat[] = [];
    public timezones: UserTimezonesSelect[] = [];
    public serverTimezone: TimezoneConfiguration | null = null;

    private readonly ProfileService = inject(ProfileService);
    private readonly UsersService = inject(UsersService);
    private readonly TimezoneService = inject(TimezoneService);
    private readonly notyService = inject(NotyService);
    private subscriptions: Subscription = new Subscription();

    public ngOnInit() {
        this.subscriptions.add(this.ProfileService.getProfile().subscribe(data => {
            this.UserPost = data.user;
            this.isLdapUser = data.isLdapUser;
        }));

        this.subscriptions.add(this.UsersService.getLocaleOptions().subscribe(data => {
            this.localeOptions = data;
        }));

        this.subscriptions.add(this.UsersService.getDateformats().subscribe(data => {
            this.dateformates = data.dateformats;
            this.timezones = data.timezones;
        }));

        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe(data => {
            this.serverTimezone = data;
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public submitUserPost() {
        if (this.UserPost) {
            // Make validation happy and also we do not want to change the users password at the moment
            this.UserPost.password = '';
            this.UserPost.confirm_password = '';

            this.subscriptions.add(this.ProfileService.updateProfile(this.UserPost)
                .subscribe((result) => {
                    if (result.success) {
                        this.notyService.genericSuccess();
                        return;
                    }

                    // Error
                    const errorResponse = result.data as GenericValidationError;
                    this.notyService.genericError();
                    if (result) {
                        this.UserErrors = errorResponse;
                        console.log(this.UserErrors);
                    }
                })
            );
        }
    }
}
