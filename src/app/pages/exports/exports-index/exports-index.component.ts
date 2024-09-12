import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import {
    QueryHandlerCheckerComponent
} from '../../../layouts/coreui/query-handler-checker/query-handler-checker.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import {
    AlertComponent,
    BorderDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormCheckInputDirective,
    RowComponent
} from '@coreui/angular';
import { NgForOf, NgIf } from '@angular/common';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import { PaginatorModule } from 'primeng/paginator';
import { ExportsService } from '../exports.service';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ExportTask, ExportValidationResult, resetExportValidation } from '../exports.interface';
import {
    SatelliteEntityWithSatelliteStatus
} from '../../../modules/distribute_module/pages/satellites/satellites.interface';
import { GenericResponseWrapper } from '../../../generic-responses';


@Component({
    selector: 'oitc-exports-index',
    standalone: true,
    imports: [
        CoreuiComponent,
        FaIconComponent,
        PermissionDirective,
        QueryHandlerCheckerComponent,
        TranslocoDirective,
        RouterLink,
        AlertComponent,
        NgIf,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        BackButtonDirective,
        CardFooterComponent,
        XsButtonDirective,
        FormCheckInputDirective,
        PaginatorModule,
        FormLoaderComponent,
        RowComponent,
        ColComponent,
        BorderDirective,
        NgForOf
    ],
    templateUrl: './exports-index.component.html',
    styleUrl: './exports-index.component.css'
})
export class ExportsIndexComponent implements OnInit, OnDestroy {

    public init = true; // avoid flashing of error messages while loading information
    public isExportRunning: boolean = false;
    public createBackup: boolean = true;
    public gearmanReachable: boolean = false;
    public exportSuccessfully: boolean = true;
    public exportValidation: ExportValidationResult = resetExportValidation();

    public tasks: ExportTask[] = [];
    public showLog: boolean = false;

    public useSingleInstanceSync: boolean = false;
    public satellites: SatelliteEntityWithSatelliteStatus[] = [];

    public isGearmanWorkerRunning: boolean = false;

    private broadcastIntervalId: any = null;
    private subscriptions: Subscription = new Subscription();
    private readonly ExportsService = inject(ExportsService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);


    public ngOnInit(): void {
        this.subscriptions.add(this.ExportsService.getIndex().subscribe(data => {
            this.isExportRunning = data.exportRunning;
            this.gearmanReachable = data.gearmanReachable;
            this.isGearmanWorkerRunning = data.isGearmanWorkerRunning;

            this.getExportStateOnPageLoad();

            this.init = false;
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public getExportStateOnPageLoad() {
        this.subscriptions.add(this.ExportsService.getIndex().subscribe(data => {
            this.isExportRunning = data.exportRunning;
            this.gearmanReachable = data.gearmanReachable;
            this.isGearmanWorkerRunning = data.isGearmanWorkerRunning;

            this.useSingleInstanceSync = data.useSingleInstanceSync;
            this.satellites = data.satellites;

            if (this.isExportRunning) {
                this.broadcastIntervalId = setInterval(() => {
                    this.ExportsService.getBroadcastStatus().subscribe(data => {
                        this.tasks = data.tasks; // Tasks to show in the log
                        this.isExportRunning = !data.exportFinished;

                        if (data.exportFinished) {
                            this.cancelBroadcastInterval();
                            this.exportSuccessfully = data.exportSuccessfully;

                            if (!data.exportSuccessfully) {
                                // Config-verify will only be done by the user who has started the export
                                this.notyService.genericError(this.TranslocoService.translate('Refresh of monitoring configuration failed.'));
                                return;
                            }

                            this.notyService.genericSuccess(data.successMessage);
                        }
                    });
                }, 1000);
            }

            this.init = false;
        }));
    }

    public launchExport() {
        this.isExportRunning = true;
        this.showLog = true;

        this.cancelBroadcastInterval();
        this.notyService.scrollTop();

        this.subscriptions.add(this.ExportsService.launchExport({
            empty: true,
            create_backup: this.createBackup ? 1 : 0
        }).subscribe((result: GenericResponseWrapper) => {
            if (result.success) {

                this.notyService.genericInfo(this.TranslocoService.translate('Refresh of monitoring configuration started successfully.'));

                this.broadcastIntervalId = setInterval(() => {
                    this.ExportsService.getBroadcastStatus().subscribe(data => {
                        this.tasks = data.tasks; // Tasks to show in the log
                        this.isExportRunning = !data.exportFinished;

                        if (data.exportFinished) {
                            this.cancelBroadcastInterval();
                            this.exportSuccessfully = data.exportSuccessfully;

                            if (!data.exportSuccessfully) {
                                this.notyService.genericError(this.TranslocoService.translate('Refresh of monitoring configuration failed.'));

                                for (const task of data.tasks) {
                                    if (
                                        (task.task === 'export_verify_new_configuration' && task.finished === 1 && task.successfully === 0) ||
                                        (task.task === 'export_verify_new_prometheus_configuration' && task.finished === 1 && task.successfully === 0)
                                    ) {
                                        // No monitoring configuration is not valid
                                        this.verifyConfig();
                                    }
                                }

                                return;
                            }

                            this.notyService.genericSuccess(data.successMessage);
                        }
                    });
                }, 1000);

                return;
            }

            // Error
            this.notyService.genericError(result.data);
        }));
    }

    private cancelBroadcastInterval() {
        if (this.broadcastIntervalId !== null) {
            clearInterval(this.broadcastIntervalId);
            this.broadcastIntervalId = null;
        }
    }

    private verifyConfig() {
        this.exportValidation = resetExportValidation();

        this.subscriptions.add(this.ExportsService.verifyConfig().subscribe(data => {
            this.exportValidation = data;
        }));
    }

}
