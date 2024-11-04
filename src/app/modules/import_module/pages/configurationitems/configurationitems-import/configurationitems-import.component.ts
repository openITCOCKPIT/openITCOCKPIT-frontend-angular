import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { DOCUMENT, NgClass, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { UiBlockerComponent } from '../../../../../components/ui-blocker/ui-blocker.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { GenericValidationError } from '../../../../../generic-responses';
import { ProfileMaxUploadLimit } from '../../../../../pages/profile/profile.interface';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ConfigurationitemsService } from '../configurationitems.service';
import Dropzone from 'dropzone';
import { AuthService } from '../../../../../auth/auth.service';
import { AgentHttpClientErrors } from '../../../../../pages/agentconnector/agentconnector.enums';
import {
    ConfigurationitemsImportFileInformation,
    ConfigurationitemsImportRelevantChanges,
    ConfigurationitemsImportRoot
} from '../configurationitems.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'oitc-configurationitems-import',
    standalone: true,
    imports: [
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormDirective,
        FormLabelDirective,
        FormLoaderComponent,
        FormsModule,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgIf,
        PermissionDirective,
        TranslocoDirective,
        UiBlockerComponent,
        XsButtonDirective,
        NgClass,
        RouterLink,
        RowComponent,
        ColComponent
    ],
    templateUrl: './configurationitems-import.component.html',
    styleUrl: './configurationitems-import.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationitemsImportComponent implements OnDestroy, AfterViewInit {

    public errors: GenericValidationError | null = null;
    public maxUploadLimit?: ProfileMaxUploadLimit;

    public hasError: boolean = false;
    public errorMessage: string = '';

    public fileInformation?: ConfigurationitemsImportFileInformation;
    public uploadSuccessful: boolean = false;
    public filenameOnServer?: string
    public importSuccessful = false;

    // Holds a list of changes that might break the current monitoring
    public hasRelevantChanges: boolean = false;
    public relevantChanges?: ConfigurationitemsImportRelevantChanges;


    private subscriptions: Subscription = new Subscription();
    private dropzoneCreated: boolean = false;
    private readonly document = inject(DOCUMENT);
    private readonly authService = inject(AuthService);
    private readonly ConfigurationitemsService = inject(ConfigurationitemsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public ngAfterViewInit(): void {
        this.loadMaxUploadLimit();
    }

    public loadMaxUploadLimit(): void {
        this.subscriptions.add(this.ConfigurationitemsService.loadMaxUploadLimit().subscribe(response => {
            this.maxUploadLimit = response;

            this.createDropzone();

        }));
    }

    public submit() {
    }

    private createDropzone() {
        let elm = this.document.getElementById('jsonImportDropzone');
        if (elm && !this.dropzoneCreated) {
            const dropzone = new Dropzone(elm, {
                method: "post",
                maxFilesize: this.maxUploadLimit?.value, //MB
                acceptedFiles: '.json', //mimetypes
                //acceptedFiles: 'image/gif,image/jpeg,image/png', //mimetypes
                paramName: "file",
                uploadMultiple: false,
                parallelUploads: 1,
                clickable: true,
                maxFiles: 1,
                addRemoveLinks: true,
                headers: {
                    'X-CSRF-TOKEN': this.authService.csrfToken || ''
                },
                url: "/import_module/configurationitems/import.json?angular=true",
                removedfile: (file: Dropzone.DropzoneFile) => {
                    this.removeFile(file);
                },
                sending: (file: Dropzone.DropzoneFile, xhr: XMLHttpRequest, formData: FormData) => {
                    this.hasRelevantChanges = false;
                    this.relevantChanges = undefined;
                    this.cdr.markForCheck();
                },
                success: (file: Dropzone.DropzoneFile) => {
                    this.cdr.markForCheck();

                    const response = file.xhr;

                    this.importSuccessful = false;
                    this.uploadSuccessful = false;
                    this.hasRelevantChanges = false;
                    this.relevantChanges = undefined;
                    let errorMessage: undefined | string = undefined;
                    if (response) {
                        const serverResponse = JSON.parse(response.response) as ConfigurationitemsImportRoot;
                        if (serverResponse.success) {
                            // Update the preview element to show check mark icon
                            this.updatePreviewElement(file, 'success');

                            this.hasError = false;
                            this.fileInformation = serverResponse.fileInformation;
                            this.filenameOnServer = serverResponse.filename;
                            this.uploadSuccessful = true

                            this.notyService.genericSuccess(
                                serverResponse.message
                            );
                            return;
                        }

                        if (serverResponse.message) {
                            errorMessage = serverResponse.message;
                        }
                    }

                    // Update the preview element to show the error message and the X icon
                    this.updatePreviewElement(file, 'error', errorMessage);
                    this.notyService.genericError(errorMessage);

                },
                error: (file: Dropzone.DropzoneFile, error: string | any, xhr: XMLHttpRequest) => {
                    this.cdr.markForCheck();

                    let message = '';
                    if (typeof error === 'string') {
                        message = error;
                    } else {
                        // Error is an object
                        // "error" contains now the server response
                        // This happens if you upload a wrong file type like ".exe" or ".pdf"
                        message = "Unknown server error";
                        if (error.hasOwnProperty('error')) {
                            message = error.error;
                        }
                    }

                    // Update the preview element to show the error message and the X icon
                    this.updatePreviewElement(file, 'error', message);

                    this.hasError = true;
                    this.errorMessage = message;

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

    private removeFile(file: Dropzone.DropzoneFile) {
        this.cdr.markForCheck();

        // Remove uploaded file from dropzone preview
        file.previewElement.parentNode?.removeChild(file.previewElement);

        // Remove file from server
        if (this.filenameOnServer) {
            const sub = this.ConfigurationitemsService.deleteUploadedFile(this.filenameOnServer).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.notyService.genericSuccess(response.message);
                    } else {
                        this.notyService.genericError(response.message);
                    }
                    this.filenameOnServer = undefined;
                    this.cdr.markForCheck();
                },
                error: (error: HttpErrorResponse) => {
                    this.notyService.genericError();
                    this.filenameOnServer = undefined;
                    this.cdr.markForCheck();
                }
            });
            this.subscriptions.add(sub);
        }

    }

    private updatePreviewElement(file: Dropzone.DropzoneFile, state: 'success' | 'error', tooltipMessage: string | undefined = undefined) {
        const previewElement = file.previewElement;

        previewElement.classList.remove('dz-processing');
        previewElement.classList.add(`dz-${state}`); // dz-error or dz-success

        const errorMessageElement = previewElement.children.item(3);  // .dz-error-message
        if (errorMessageElement && tooltipMessage) {
            errorMessageElement.children[0].innerHTML = tooltipMessage; // .dz-error-message span
        }
    }

    protected readonly AgentHttpClientErrors = AgentHttpClientErrors;

}
