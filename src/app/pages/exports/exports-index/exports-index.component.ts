import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
    BadgeComponent,
    BorderDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { NgForOf, NgIf } from '@angular/common';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import { PaginatorModule } from 'primeng/paginator';
import { ExportsService } from '../exports.service';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { NotyService } from '../../../layouts/coreui/noty.service';
import {
    ExportSatelliteSelectionPost,
    ExportTask,
    ExportValidationResult,
    resetExportValidation
} from '../exports.interface';
import {
    SatelliteEntityWithSatelliteStatus
} from '../../../modules/distribute_module/pages/satellites/satellites.interface';
import { GenericResponseWrapper } from '../../../generic-responses';
import { MatSort } from '@angular/material/sort';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { UiBlockerComponent } from '../../../components/ui-blocker/ui-blocker.component';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';


@Component({
    selector: 'oitc-exports-index',
    standalone: true,
    imports: [

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
        NgForOf,
        MatSort,
        TableDirective,
        FormCheckComponent,
        TrueFalseDirective,
        ItemSelectComponent,
        ContainerComponent,
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        SelectAllComponent,
        UiBlockerComponent,
        BadgeComponent
    ],
    templateUrl: './exports-index.component.html',
    styleUrl: './exports-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
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
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);

    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.ExportsService.getIndex().subscribe(data => {
            this.isExportRunning = data.exportRunning;
            this.gearmanReachable = data.gearmanReachable;
            this.isGearmanWorkerRunning = data.isGearmanWorkerRunning;

            this.cdr.markForCheck();
            this.getExportStateOnPageLoad();

            this.init = false;
        }));
    }

    public ngOnDestroy(): void {
        this.cancelBroadcastInterval();
        this.subscriptions.unsubscribe();
    }

    public getExportStateOnPageLoad() {
        this.subscriptions.add(this.ExportsService.getIndex().subscribe(data => {
            this.cdr.markForCheck();
            this.isExportRunning = data.exportRunning;
            this.gearmanReachable = data.gearmanReachable;
            this.isGearmanWorkerRunning = data.isGearmanWorkerRunning;

            this.useSingleInstanceSync = data.useSingleInstanceSync;
            this.satellites = data.satellites;

            if (this.isExportRunning) {
                this.broadcastIntervalId = setInterval(() => {
                    this.ExportsService.getBroadcastStatus().subscribe(data => {
                        this.cdr.markForCheck();
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
            create_backup: this.createBackup ? 1 : 0,
            satellites: this.getSelectedSatellitesForPost(),
        }).subscribe((result: GenericResponseWrapper) => {
            this.cdr.markForCheck();
            if (result.success) {

                this.notyService.genericInfo(this.TranslocoService.translate('Refresh of monitoring configuration started successfully.'));

                this.broadcastIntervalId = setInterval(() => {
                    this.ExportsService.getBroadcastStatus().subscribe(data => {
                        this.cdr.markForCheck();
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

    public saveSatelliteSelection() {
        const post = this.getSelectedSatellitesForPost();
        if (post.length > 0) {
            this.subscriptions.add(this.ExportsService.saveSatelliteSelection(post).subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    this.notyService.genericSuccess();
                    return;
                }

                // Error
                this.notyService.genericError();
            }));
        }
    }

    private cancelBroadcastInterval() {
        this.cdr.markForCheck();
        if (this.broadcastIntervalId !== null) {
            clearInterval(this.broadcastIntervalId);
            this.broadcastIntervalId = null;
        }
    }

    private verifyConfig() {
        this.exportValidation = resetExportValidation();

        this.subscriptions.add(this.ExportsService.verifyConfig().subscribe(data => {
            this.exportValidation = data;
            this.cdr.markForCheck();
        }));
    }

    private getSelectedSatellitesForPost(): ExportSatelliteSelectionPost[] {
        if (!this.useSingleInstanceSync || this.satellites.length === 0) {
            return [];
        }

        const selectedSatellites = this.SelectionServiceService.getSelectedItems();
        let result: ExportSatelliteSelectionPost[] = [];

        // Have all satellites been deselected?
        if (selectedSatellites.length === 0 && this.satellites.length > 0) {
            for (let satellite of this.satellites) {
                result.push({
                    id: satellite.id,
                    sync_instance: 0
                });
            }

            return result;
        }


        // We have selected Satellite Systems
        // Mark all satellites as not selected first, then only pick the selected ones
        for (let satellite of this.satellites) {
            const id = satellite.id;
            let selectedSatellite = selectedSatellites.find((item) => item.id === id);

            if (selectedSatellite) {
                // Sattelite is selected
                result.push({
                    id: satellite.id,
                    sync_instance: 1
                });
            } else {
                // Satellite is not selected
                result.push({
                    id: satellite.id,
                    sync_instance: 0
                });
            }
        }

        return result;
    }

}
