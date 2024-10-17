import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    ButtonCloseDirective,
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
    InputGroupComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ModalToggleDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputCopyComponent } from '../../../layouts/coreui/input-copy/input-copy.component';
import { NgForOf, NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ProfileApikey, ProfileCreateApiKey } from '../profile.interface';
import { GenericMessageResponse, GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ProfileService } from '../profile.service';
import { UsersService } from '../../users/users.service';


@Component({
    selector: 'oitc-profile-apikeys',
    standalone: true,
    imports: [
        BackButtonDirective,
        ButtonCloseDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,

        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        InputCopyComponent,
        InputGroupComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NgSelectModule,
        ReactiveFormsModule,
        RequiredIconComponent,
        RowComponent,
        TableDirective,
        TranslocoDirective,
        TrueFalseDirective,
        XsButtonDirective,
        ModalToggleDirective
    ],
    templateUrl: './profile-apikeys.component.html',
    styleUrl: './profile-apikeys.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileApikeysComponent implements OnInit, OnDestroy {

    public readonly hostname = window.location.hostname;
    public Apikeys: ProfileApikey[] = [];

    public ApikeyCreatePost: ProfileCreateApiKey = {
        apikey: '',
        qrcode: '',
        description: ''
    };
    public ApikeyErrors: GenericValidationError | null = null;

    public ApiKeyEditPost: ProfileApikey | null = null;
    public ApiKeyEditQrCode: string = '';
    public ApikeyEditErrors: GenericValidationError | null = null;


    private subscriptions: Subscription = new Subscription();
    private readonly ProfileService = inject(ProfileService);
    private readonly UsersService = inject(UsersService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly modalService = inject(ModalService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.loadApiKeys();
    }

    public loadApiKeys() {
        this.subscriptions.add(this.ProfileService.getApiKeys().subscribe(data => {
            this.Apikeys = data;
            this.cdr.markForCheck();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadNewApiKey() {
        this.subscriptions.add(this.ProfileService.generateNewApiKey()
            .subscribe((result) => {
                this.cdr.markForCheck();
                const currentDescription = this.ApikeyCreatePost.description;
                this.ApikeyCreatePost = result;
                this.ApikeyCreatePost.description = currentDescription;
            })
        );
    }

    public submitNewApiKey() {
        this.subscriptions.add(this.ProfileService.saveNewApiKey(this.ApikeyCreatePost.description)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericMessageResponse;

                    this.notyService.genericSuccess(response.message);
                    this.modalService.toggle({
                        show: false,
                        id: 'createNewApiKeyModal',
                    });

                    this.ApikeyCreatePost = {
                        apikey: '',
                        qrcode: '',
                        description: ''
                    };

                    this.loadApiKeys();
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.ApikeyErrors = errorResponse;
                }
            })
        );
    }

    public editApiKey(id: number) {
        this.subscriptions.add(this.ProfileService.getApiKeyEdit(id)
            .subscribe((result) => {
                this.cdr.markForCheck();

                this.ApiKeyEditPost = result.apikey;
                this.ApiKeyEditQrCode = result.qrcode;

                this.modalService.toggle({
                    show: true,
                    id: 'editApiKeyModal',
                });
            })
        );
    }

    public deleteApiKey(id: number) {
        this.subscriptions.add(this.ProfileService.deleteApiKey(id)
            .subscribe((result) => {
                this.cdr.markForCheck();

                if (result.success) {
                    const response = result.data as GenericMessageResponse;

                    this.notyService.genericSuccess(response.message);
                    this.modalService.toggle({
                        show: false,
                        id: 'editApiKeyModal',
                    });

                    this.loadApiKeys();
                    return;
                }

                // Error
                this.notyService.genericError();
                console.log(result);
            })
        );
    }

    public submitEditApiKey() {
        if (this.ApiKeyEditPost) {

            this.ApikeyEditErrors = null;

            this.subscriptions.add(this.ProfileService.updateApiKey(this.ApiKeyEditPost.id, this.ApiKeyEditPost.description)
                .subscribe((result) => {
                    this.cdr.markForCheck();

                    if (result.success) {
                        const response = result.data as GenericMessageResponse;

                        this.notyService.genericSuccess(response.message);
                        this.modalService.toggle({
                            show: false,
                            id: 'editApiKeyModal',
                        });

                        this.loadApiKeys();
                        return;
                    }

                    // Error
                    const errorResponse = result.data as GenericValidationError;
                    this.notyService.genericError();
                    if (result) {
                        this.ApikeyEditErrors = errorResponse;
                    }
                })
            );
        }
    }
}
