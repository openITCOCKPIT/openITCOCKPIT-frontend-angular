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
import { GenericMessageResponse } from '../../../../generic-responses';
import { TableLoaderComponent } from '../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { FormsModule } from '@angular/forms';
import { ImportersService } from '../../pages/importers/importers.service';
import { Importer, ImporterConfig, ImportersErrorMessageResponse } from '../../pages/importers/importers.interface';
import { ImportDataResponse, ImportedHostRawData } from '../../pages/importedhosts/importedhosts.interface';
import { DynamicalFormFields } from '../../../../components/dynamical-form-fields/dynamical-form-fields.interface';
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
        notValidRawData?: any
    };
    public showSynchronizingSpinner: boolean = false;
    public showSpinner: boolean = false;
    public errors: GenericMessageResponse | null = null;
    public hasRootPrivileges: boolean = false;
    private cdr = inject(ChangeDetectorRef);
    public formFields?: DynamicalFormFields;


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
                if (this.importer.data_source) {
                    this.ImporterService.loadConfig(this.importer.data_source)
                        .subscribe((result:ImporterConfig) => {
                            this.formFields = result.config.formFields;
                            this.cdr.markForCheck();
                        });
                }
console.log(this.formFields);
                switch (this.importer.data_source) {
                    case 'idoit':
                        this.ImporterService.loadDataFromIdoit(this.importer).subscribe(data => {
                            if (data.success) {
                                let response = data.data as ImportDataResponse;
                                this.importData = {
                                    success: true,
                                    data: response.response.rawData
                                }
                                this.cdr.markForCheck();
                            }
                            if (!data.success) {
                                let response = data.data as ImportersErrorMessageResponse;
                                this.importData = {
                                    success: false,
                                    errorMessage: response.message,
                                    notValidRawData: response.errors.notValidRawData
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
                                    data: response.response.rawData
                                }
                                this.cdr.markForCheck();
                            }
                            if (!data.success) {
                                let response = data.data as ImportersErrorMessageResponse;
                                this.importData = {
                                    success: false,
                                    errorMessage: response.message,
                                    notValidRawData: response.errors.notValidRawData
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
                                    data: response.response.rawData
                                }
                                this.cdr.markForCheck();
                            }
                            if (!data.success) {
                                let response = data.data as ImportersErrorMessageResponse;
                                this.importData = {
                                    success: false,
                                    errorMessage: response.message,
                                    notValidRawData: response.errors.notValidRawData
                                }
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
                                    data: response.response.rawData
                                }
                                this.cdr.markForCheck();
                            }
                            if (!data.success) {
                                let response = data.data as ImportersErrorMessageResponse;
                                this.importData = {
                                    success: false,
                                    errorMessage: response.message,
                                    notValidRawData: (response.errors && response.errors.notValidRawData) ? response.errors.notValidRawData : []
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
            this.errors = null;
            /*
            this.ExternalSystemService.startDataImport(this.externalSystem, this.ignoreExternalSystem).subscribe(data => {
                this.cdr.markForCheck();
                this.showSynchronizingSpinner = false;
                this.showSpinner = false;
                if (data.success) {
                    this.hideModal();
                    this.completed.emit(true);
                }
            });

             */
        }
    }
}
