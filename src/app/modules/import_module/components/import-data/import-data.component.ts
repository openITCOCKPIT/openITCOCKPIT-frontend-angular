import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {
    AlertComponent,
    AlertHeadingDirective,
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
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';

import { PermissionDirective } from '../../../../permissions/permission.directive';
import { Router, RouterLink } from '@angular/router';
import { TableLoaderComponent } from '../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { FormsModule } from '@angular/forms';
import { ImportersService } from '../../pages/importers/importers.service';
import {
    GenericKeyValueFieldType,
    Importer,
    ImporterConfig,
    ImportersErrorMessageResponse
} from '../../pages/importers/importers.interface';
import { ImportDataResponse, ImportedHostRawData } from '../../pages/importedhosts/importedhosts.interface';
import _ from 'lodash';

@Component({
    selector: 'oitc-import-data',
    imports: [
        ButtonCloseDirective,
        ColComponent,
        FaIconComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NgForOf,
        NgIf,
        RowComponent,
        TranslocoDirective,
        XsButtonDirective,
        FaStackComponent,
        FaStackItemSizeDirective,
        PermissionDirective,
        RouterLink,
        AlertComponent,
        AlertHeadingDirective,
        TableLoaderComponent,
        TableDirective,
        FormsModule
    ],
    templateUrl: './import-data.component.html',
    styleUrl: './import-data.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportDataComponent implements OnInit, OnDestroy {
    @ViewChild('modal') private modal!: ModalComponent;
    @Output() completed = new EventEmitter<boolean>();

    public readonly router = inject(Router);
    private subscriptions: Subscription = new Subscription();
    private readonly modalService = inject(ModalService);
    private readonly ImporterService = inject(ImportersService);

    public importer?: Importer;
    protected importData?: {
        data?: ImportedHostRawData[]
        success: boolean
        errorMessage?: string
        message?: string
        errors?: any
    };
    public showSynchronizingSpinner: boolean = false;
    public showSpinner: boolean = false;
    private cdr = inject(ChangeDetectorRef);
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
            if (state.show === true && state.id === 'importDataModal') {
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
                switch (this.importer.data_source) {
                    case 'idoit':
                        this.ImporterService.loadDataFromIdoit(this.importer).subscribe(data => {
                            if (data.success) {
                                let response = data.data as ImportDataResponse;
                                this.importData = {
                                    success: true,
                                    data: response.response.rawData,
                                    errors: response.response.errors || null,
                                    message: response.response.message
                                }
                                console.log(this.importData);
                                this.cdr.markForCheck();
                            }
                            if (!data.success) {
                                let response = data.data as ImportersErrorMessageResponse;
                                let notValidData: any = [];
                                if (response.errors && response.errors.notValidRawData) {
                                    notValidData = response.errors.notValidRawData;
                                }
                                this.importData = {
                                    success: false,
                                    errorMessage: response.message,
                                    errors: notValidData
                                }
                            }
                            this.cdr.markForCheck();

                        });
                        break;
                    case 'openitcockpit_agent':
                        this.ImporterService.loadDataFromOITCAgent(this.importer).subscribe(data => {
                            if (data.success) {
                                let response = data.data as ImportDataResponse;
                                this.importData = {
                                    success: true,
                                    data: response.response.rawData,
                                    errors: response.response.errors || null,
                                    message: response.message
                                }
                                this.cdr.markForCheck();
                            }
                            if (!data.success) {
                                let response = data.data as ImportersErrorMessageResponse;
                                if (!response.errors) {
                                    this.importData = {
                                        success: false,
                                        errorMessage: response.message,
                                        errors: response.message
                                    }
                                } else {
                                    this.importData = {
                                        success: false,
                                        errorMessage: response.message,
                                        errors: response.errors.notValidRawData ?? 'error'
                                    }
                                }
                            }
                            this.cdr.markForCheck();

                        });
                        break;
                    case 'itop':
                        this.ImporterService.loadDataFromITop(this.importer).subscribe(data => {
                            if (data.success) {
                                let response = data.data as ImportDataResponse;
                                this.importData = {
                                    success: true,
                                    data: response.response.rawData,
                                    errors: response.response.errors || null,
                                    message: response.response.message
                                }
                                this.cdr.markForCheck();
                            }
                            if (!data.success) {
                                let response = data.data as ImportersErrorMessageResponse;
                                let notValidData: any = [];
                                if (response.errors && response.errors.notValidRawData) {
                                    notValidData = response.errors.notValidRawData;
                                }
                                this.importData = {
                                    success: false,
                                    errorMessage: response.message,
                                    errors: notValidData
                                }
                                this.cdr.markForCheck();
                            }
                            this.cdr.markForCheck();

                        });
                        break;
                    case 'external_monitoring':
                        this.ImporterService.loadDataFromExternalMonitoring(this.importer).subscribe(data => {
                            if (data.success) {
                                let response = data.data as ImportDataResponse;
                                this.importData = {
                                    success: true,
                                    data: response.response.rawData,
                                    errors: response.response.errors || null,
                                }
                                this.cdr.markForCheck();
                            }
                            if (!data.success) {
                                let response = data.data as ImportersErrorMessageResponse;
                                let notValidData: any = [];
                                if (response.errors && response.errors.notValidRawData) {
                                    notValidData = response.errors.notValidRawData;
                                }
                                this.importData = {
                                    success: false,
                                    errorMessage: response.message,
                                    errors: notValidData
                                }
                            }
                            this.cdr.markForCheck();

                        });
                        break;

                    default:
                        console.log('External System not supported yet')
                        return;
                }
            }
        }));

    }

    public hideModal() {
        this.importData = undefined;
        this.modalService.toggle({
            show: false,
            id: 'importDataModal'
        });
    }


    public startDataImport() {
        this.cdr.markForCheck();
        if (this.importer && !this.importer.id) {
            return;
        }

        if (this.importer) {
            this.showSpinner = true;
            this.showSynchronizingSpinner = true;
            this.ImporterService.startDataImport(this.importer, undefined).subscribe(data => {
                this.cdr.markForCheck();
                this.showSynchronizingSpinner = false;
                this.showSpinner = false;
                if (data.success) {
                    this.hideModal();
                    this.completed.emit(true);
                } else {
                    this.importData = {
                        success: false,
                        errorMessage: data.data.error,
                        errors: []
                    }
                }
            });
        }
    }
}
