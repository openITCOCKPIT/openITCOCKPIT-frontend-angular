import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
    ModalService,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { GenericValidationError } from '../../../generic-responses';
import { ProfileMaxUploadLimit, ProfileUser } from '../profile.interface';
import { DOCUMENT, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ProfileService } from '../profile.service';

import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { UsersService } from '../../users/users.service';
import { UserLocaleOption, UserTimezonesSelect } from '../../users/users.interface';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { TimezoneConfiguration, TimezoneService } from '../../../services/timezone.service';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import Dropzone from 'dropzone';
import { AuthService } from '../../../auth/auth.service';


import { ProfileApikeysComponent } from '../profile-apikeys/profile-apikeys.component';
import { ProfileChangePasswordComponent } from '../profile-change-password/profile-change-password.component';
import { SelectKeyValueString } from '../../../layouts/primeng/select.interface';

@Component({
    selector: 'oitc-profile-edit',
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
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
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        TrueFalseDirective,
        NgSelectModule,
        NgOptionHighlightModule,
        FormDirective,
        XsButtonDirective,
        BackButtonDirective,
        ColComponent,
        RowComponent,
        ProfileApikeysComponent,
        ProfileChangePasswordComponent
    ],
    templateUrl: './profile-edit.component.html',
    styleUrl: './profile-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileEditComponent implements OnInit, OnDestroy {

    public UserErrors: GenericValidationError | null = null;
    public UserPost: ProfileUser | null = null;
    public isLdapUser: boolean = false;
    public maxUploadLimit: ProfileMaxUploadLimit | null = null;
    public localeOptions: UserLocaleOption[] = [];
    public dateformates: SelectKeyValueString[] = [];
    public timezones: UserTimezonesSelect[] = [];
    public serverTimezone: TimezoneConfiguration | null = null;


    private dropzoneCreated: boolean = false;
    private readonly ProfileService = inject(ProfileService);
    private readonly UsersService = inject(UsersService);
    private readonly TimezoneService = inject(TimezoneService);
    private readonly notyService = inject(NotyService);
    private readonly authService = inject(AuthService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly modalService = inject(ModalService);
    private readonly document = inject(DOCUMENT);
    private cdr = inject(ChangeDetectorRef);

    private subscriptions: Subscription = new Subscription();

    public constructor() {
        // disable dropzone auto discover
        // https://github.com/zefoy/ngx-dropzone-wrapper/blob/fb39139147f3a6d72bcaff51c3c32e2a54e31c9d/src/lib/dropzone.directive.ts#L60
        const dz = Dropzone;
        dz.autoDiscover = false;
    }

    public ngOnInit() {
        this.loadUser();

        this.subscriptions.add(this.UsersService.getLocaleOptions().subscribe(data => {
            this.localeOptions = data;
            this.cdr.markForCheck();
        }));

        this.subscriptions.add(this.UsersService.getDateformats().subscribe(data => {
            this.dateformates = data.dateformats;
            this.timezones = data.timezones;
            this.cdr.markForCheck();
        }));

        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe(data => {
            this.serverTimezone = data;
            this.cdr.markForCheck();
        }));
    }

    private loadUser() {
        // This is an own method, so we can call it to update the page after a user has uploaded a profile image or so
        this.subscriptions.add(this.ProfileService.getProfile().subscribe(data => {
            this.UserPost = data.user;
            this.isLdapUser = data.isLdapUser;
            this.maxUploadLimit = data.maxUploadLimit;

            this.createDropzone();
            this.cdr.markForCheck();
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
                    this.cdr.markForCheck();
                    if (result.success) {
                        this.notyService.genericSuccess();
                        this.UserErrors = null;
                        return;
                    }

                    // Error
                    const errorResponse = result.data as GenericValidationError;
                    this.notyService.genericError();
                    if (result) {
                        this.UserErrors = errorResponse;
                    }
                })
            );
        }
    }

    public deleteUserImage() {
        if (this.UserPost) {
            this.subscriptions.add(this.ProfileService.deleteUserImage()
                .subscribe((result) => {
                    this.cdr.markForCheck();
                    if (result.success) {
                        this.notyService.genericSuccess();
                        this.loadUser();

                        // Notify the avatar component that the image has changed
                        this.ProfileService.notifyProfileImageChanged();
                    } else {
                        this.notyService.genericError();
                    }
                })
            );
        }
    }

    public createDropzone() {
        let elm = this.document.getElementById('profileImageDropzone');
        if (elm && !this.dropzoneCreated) {
            const dropzone = new Dropzone(elm, {
                method: "post",
                maxFilesize: this.maxUploadLimit?.value, //MB
                //acceptedFiles: 'image/gif,image/jpeg,image/png', //mimetypes
                //acceptedFiles: 'image/gif,image/jpeg,image/png', //mimetypes
                paramName: "Picture",
                headers: {
                    'X-CSRF-TOKEN': this.authService.csrfToken || ''
                },
                url: "/profile/upload_profile_icon.json?angular=true",
                success: (file: Dropzone.DropzoneFile) => {
                    this.notyService.genericSuccess();
                    this.loadUser();
                    // Notify the avatar component that the image has changed
                    this.ProfileService.notifyProfileImageChanged();
                },
                error: (file: Dropzone.DropzoneFile, message: string, xhr: XMLHttpRequest) => {
                    if (typeof xhr === 'undefined') {
                        // User tried to upload illegal file types such as .pdf or so
                        this.notyService.genericError(message);
                    } else {
                        // File got uploaded to the server, but server returned an error
                        let response = message as unknown as Error;
                        this.notyService.genericError(response.message);
                    }
                }
            });
            this.dropzoneCreated = true;
            this.cdr.markForCheck();
        }
    }


}
