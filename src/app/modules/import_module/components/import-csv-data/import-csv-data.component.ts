import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {
    ButtonCloseDirective,
    ColComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { DOCUMENT, NgClass, NgForOf, NgIf } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';

import { PermissionDirective } from '../../../../permissions/permission.directive';
import { Router, RouterLink } from '@angular/router';
import { GenericMessageResponse } from '../../../../generic-responses';
import { FormsModule } from '@angular/forms';
import { ImportersService } from '../../pages/importers/importers.service';
import {
    CsvErrors,
    CsvPreviewData,
    CsvPreviewHeadersAsArray,
    GenericKeyValueFieldType,
    ImportCsvDataResponse,
    Importer,
    ImporterConfig
} from '../../pages/importers/importers.interface';
import { ImportedHostRawData, MaxUploadLimit } from '../../pages/importedhosts/importedhosts.interface';
import Dropzone from 'dropzone';
import { AuthService } from '../../../../auth/auth.service';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { GenericKeyValue } from '../../../../generic.interfaces';
import _ from 'lodash';

@Component({
    selector: 'oitc-import-csv-data',
    imports: [
        ButtonCloseDirective,
        ColComponent,
        FaIconComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NgIf,
        RowComponent,
        TranslocoDirective,
        XsButtonDirective,
        FaStackComponent,
        FaStackItemSizeDirective,
        PermissionDirective,
        RouterLink,
        FormsModule,
        TableDirective,
        NgForOf,
        NgClass
    ],
    templateUrl: './import-csv-data.component.html',
    styleUrl: './import-csv-data.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportCsvDataComponent implements OnInit, OnDestroy {
    @ViewChild('modal') private modal!: ModalComponent;
    @Output() completed = new EventEmitter<boolean>();
    @Input() maxUploadLimit!: MaxUploadLimit | undefined;

    public readonly router = inject(Router);
    private subscriptions: Subscription = new Subscription();
    private readonly modalService = inject(ModalService);
    private readonly ImporterService = inject(ImportersService);

    public importer?: Importer;
    protected importData?: {
        data?: ImportedHostRawData[]
        success: boolean
        errorMessage?: string
        notValidRawData?: any
    };

    public previewData!: CsvPreviewData | null;
    public headersForTemplate: CsvPreviewHeadersAsArray[] = [];
    public rawDataForTemplate: GenericKeyValue[][] = [];
    public rawInvalidDataForTemplate: GenericKeyValue[][] = [];
    public numberOfHeaders: number = 0;
    public importProcessRun: boolean = false;
    public importSuccessfullyFinished: boolean = false;
    public synchronizingSuccessfullyFinished: boolean = false;

    public showSynchronizingSpinner: boolean = false;
    public showSpinner: boolean = false;
    public errors: GenericMessageResponse | null = null;
    public csvErrors: CsvErrors | null = null;
    private cdr = inject(ChangeDetectorRef);
    private dropzoneCreated: boolean = false;
    private readonly document = inject(DOCUMENT);
    private readonly authService = inject(AuthService);
    public uploadSuccessful: boolean = false;
    public filenameOnServer?: string
    public importSuccessful = false;
    public hasError: boolean = false;
    public errorMessage: string = '';
    private readonly notyService = inject(NotyService);
    public dynamicFieldsNameValue: GenericKeyValueFieldType[] = [];


    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public ngOnInit() {
        this.ImporterService.modalImporter$$.subscribe((importer: Importer) => {
            this.importer = importer;
            this.cdr.markForCheck();
        });


        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            this.cdr.markForCheck();
            if (state.show === true && state.id === 'importCsvDataModal') {
                if (!this.importer) {
                    return;
                }
                if (this.importer.data_source && this.importer.config && this.importer.config.mapping) {
                    let importerConfig = this.importer.config;
                    this.ImporterService.loadConfig(this.importer.data_source)
                        .subscribe((result: ImporterConfig) => {
                            this.dynamicFieldsNameValue = [];
                            _.forEach(result.config.formFields, (value, key) => {
                                let fieldValue = importerConfig.mapping[value.ngModel];
                                if (value.type === 'select') {
                                    if (value.options) {
                                        value.options.forEach((option: any) => {
                                            if (option.key === fieldValue) {
                                                fieldValue = option.value;
                                            }
                                        });
                                    }
                                }
                                this.dynamicFieldsNameValue.push({
                                    label: value.label,
                                    value: fieldValue,
                                    type: value.type
                                });


                            });
                            this.cdr.markForCheck();
                        });
                }

                this.createDropzone();
            }
        }));

    }

    public hideModal() {
        this.importData = undefined;
        this.modalService.toggle({
            show: false,
            id: 'importCsvData'
        });
    }


    public startDataImport() {
        this.cdr.markForCheck();
        if (this.importer && !this.importer.id && !this.importer.data_source) {
            return;
        }

        if((this.importer?.data_source === 'csv_with_header' || this.importer?.data_source === 'csv_without_header')
            && (!this.filenameOnServer && !this.uploadSuccessful)) {
           return;

        }

        if (this.importer) {
            this.showSpinner = true;
            this.showSynchronizingSpinner = true;
            this.errors = null;
            this.ImporterService.startDataImport(this.importer, this.filenameOnServer).subscribe(data => {
                this.cdr.markForCheck();
                this.showSynchronizingSpinner = false;
                this.showSpinner = false;
                if (data.success) {
                    this.hideModal();
                    this.completed.emit(true);
                }
            });
        }
    }

    private createDropzone() {
        let elm = this.document.getElementById('csvDropzone');
        if (this.importer && elm && !this.dropzoneCreated) {
            const dropzone = new Dropzone(elm, {
                method: "post",
                maxFilesize: this.maxUploadLimit?.value, //MB
                acceptedFiles: '.csv', //mimetypes
                paramName: "file",
                uploadMultiple: false,
                parallelUploads: 1,
                clickable: true,
                maxFiles: 1,
                addRemoveLinks: true,
                headers: {
                    'X-CSRF-TOKEN': this.authService.csrfToken || ''
                },
                url: '/import_module/importedHosts/importCsv/' + this.importer.id + '.json',
                removedfile: (file: Dropzone.DropzoneFile) => {
                    this.removeFile(file);
                },
                sending: (file: Dropzone.DropzoneFile, xhr: XMLHttpRequest, formData: FormData) => {
                    this.cdr.markForCheck();
                },
                success: (file: Dropzone.DropzoneFile) => {
                    this.cdr.markForCheck();

                    const response = file.xhr;

                    this.importSuccessful = false;
                    this.uploadSuccessful = false;
                    let errorMessage: undefined | string = undefined;
                    if (response) {
                        const serverResponse = JSON.parse(response.response) as ImportCsvDataResponse;

                        if (serverResponse.response.success) {
                            // Update the preview element to show check mark icon
                            this.updatePreviewElement(file, 'success');
                            this.previewData = serverResponse.response.previewData;
                            this.numberOfHeaders = Object.keys(this.previewData.headers).length;
                            if (this.numberOfHeaders > 0) {
                                this.headersForTemplate = [];
                                for (let header in this.previewData.headers) {
                                    // @ts-ignore
                                    const value = this.previewData.headers[header];
                                    this.headersForTemplate.push(
                                        {
                                            key: header,
                                            name: value.name,
                                            exists: value.exists
                                        }
                                    );
                                }
                            }
                            this.rawDataForTemplate = [];
                            if (this.previewData.rawData.length > 0) {
                                this.previewData.rawData.forEach((rawData, index) => {
                                    let tr: GenericKeyValue[] = [];
                                    for (const key in rawData) {
                                        if (rawData.hasOwnProperty(key) && key !== 'external_services') {
                                            tr.push(
                                                {
                                                    key: key,
                                                    value: rawData[key as keyof ImportedHostRawData]
                                                }
                                            );

                                        }
                                    }
                                    this.rawDataForTemplate.push(tr);
                                });
                            }

                            this.rawInvalidDataForTemplate = [];
                            if (this.previewData.errors) {
                                if (this.previewData.errors.notValidRawData && this.previewData.errors.notValidRawData.invalidData.length > 0) {
                                    this.previewData.errors.notValidRawData.invalidData.forEach((rawData, index) => {
                                        let tr: GenericKeyValue[] = [];
                                        for (const key in rawData) {
                                            if (rawData.hasOwnProperty(key)) {
                                                tr.push(
                                                    {
                                                        key: key,
                                                        value: rawData[key as keyof ImportedHostRawData]
                                                    }
                                                );

                                            }
                                        }
                                        this.rawInvalidDataForTemplate.push(tr);
                                    });
                                }
                            }


                            this.importProcessRun = false;
                            this.csvErrors = null;

                            if (this.previewData.hasOwnProperty('errors')) {
                                this.csvErrors = this.previewData.errors;
                            }

                            this.hasError = false;
                            //this.fileInformation = serverResponse.fileInformation;
                            this.filenameOnServer = serverResponse.response.filename;
                            this.uploadSuccessful = true

                            this.notyService.genericSuccess(
                                serverResponse.response.message
                            );
                            return;
                        }

                        if (serverResponse.response.message) {
                            errorMessage = serverResponse.response.message;
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
        this.csvErrors = null;
        this.rawInvalidDataForTemplate = [];
        this.rawDataForTemplate = [];
        this.previewData = null;
        this.errors = null;

        this.cdr.markForCheck();
        // Remove uploaded file from dropzone preview
        file.previewElement.parentNode?.removeChild(file.previewElement);

        return;

        // This code is disabled, as we do not know for sure which file to delete if a user drops
        // more than one file into the dropzone.
        // So for now we just remove the file from the preview and do not delete it from the server.

        // Remove file from server
        //if (this.filenameOnServer) {
        //    const sub = this.ConfigurationitemsService.deleteUploadedFile(this.filenameOnServer).subscribe({
        //        next: (response) => {
        //            if (response.success) {
        //                this.notyService.genericSuccess(response.message);
        //            } else {
        //                this.notyService.genericError(response.message);
        //            }
        //            this.filenameOnServer = undefined;
        //            this.cdr.markForCheck();
        //        },
        //        error: (error: HttpErrorResponse) => {
        //            this.notyService.genericError();
        //            this.filenameOnServer = undefined;
        //            this.cdr.markForCheck();
        //        }
        //    });
        //    this.subscriptions.add(sub);
        //}

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

    protected readonly Object = Object;
}
