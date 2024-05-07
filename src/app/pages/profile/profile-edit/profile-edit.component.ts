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
import { UserDateformat, UserLocaleOption } from '../../users/users.interface';
import { NgSelectModule } from '@ng-select/ng-select';

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
        NgSelectModule
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

    private readonly ProfileService = inject(ProfileService);
    private readonly UsersService = inject(UsersService);
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
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
