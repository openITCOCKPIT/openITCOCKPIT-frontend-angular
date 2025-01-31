import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { OitcAlertComponent } from '../../../../../components/alert/alert.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BlockLoaderComponent } from '../../../../../layouts/primeng/loading/block-loader/block-loader.component';
import { CreatePanelPost, GrafanaEditorDashboardRow, GrafanaEditorGetResponse } from './grafana-editor.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { GrafanaEditorService } from './grafana-editor.service';
import { HistoryService } from '../../../../../history.service';
import { GrafanaRowComponent, RowPanelsChangedEvent } from './grafana-row/grafana-row.component';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    SynchronizeGrafanaModalComponent
} from '../../../components/synchronize-grafana-modal/synchronize-grafana-modal.component';
import { GrafanaChartTypesEnum } from './grafana-panel/chart-type-icon/GrafanaChartTypes.enum';


@Component({
    selector: 'oitc-grafana-userdashboards-editor',
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormDirective,
        FormsModule,
        NgIf,
        OitcAlertComponent,
        PermissionDirective,
        ReactiveFormsModule,
        TranslocoDirective,
        TranslocoPipe,
        RouterLink,
        BackButtonDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
        BlockLoaderComponent,
        GrafanaRowComponent,
        RowComponent,
        ColComponent,
        SynchronizeGrafanaModalComponent
    ],
    templateUrl: './grafana-userdashboards-editor.component.html',
    styleUrl: './grafana-userdashboards-editor.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrafanaUserdashboardsEditorComponent implements OnInit, OnDestroy {

    public id: number = 0;
    public data?: GrafanaEditorGetResponse;
    public selectedItems: DeleteAllItem[] = []; // For synchronize modal

    private subscriptions: Subscription = new Subscription();
    private readonly GrafanaEditorService = inject(GrafanaEditorService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly modalService = inject(ModalService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.id = id;
            this.loadDashboard();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadDashboard(): void {
        this.subscriptions.add(this.GrafanaEditorService.getGrafanaUserdashboardForEditor(this.id).subscribe(response => {
            this.data = response;
            this.selectedItems = [];
            this.cdr.markForCheck();
        }));
    }

    public addRow(): void {
        if (!this.data || this.id <= 0) {
            return;
        }

        this.subscriptions.add(this.GrafanaEditorService.addRow(this.id).subscribe(response => {
            if (response.success) {
                this.notyService.genericSuccess(
                    this.TranslocoService.translate('Row added successfully')
                );

                //Add new created panel to local json
                this.loadDashboard();
            } else {
                this.notyService.genericError(
                    this.TranslocoService.translate('Error while adding row')
                );
            }
        }));
    }

    /**
     * Generic function to handle mass action completion like synchronize with Grafana
     * @param success
     */
    public onMassActionComplete(success: boolean): void {
        return;
    }

    /**
     * Handle events from child components when panels are changed
     * @param panelsEvent
     */
    public onRowPanelsChanged(panelsEvent: RowPanelsChangedEvent): void {
        if (!this.data) {
            return;
        }


        // Update the local data with the new panels
        this.data.userdashboardData.rows[panelsEvent.rowIndex] = panelsEvent.panels;
        this.cdr.markForCheck();
    }

    /**
     * Handle events from child components when a row should be removed
     * @param rowIndex
     */
    public onRowRemove(rowIndex: number) {
        if (!this.data) {
            return;
        }

        // Update the local data with the removed row
        this.subscriptions.add(this.GrafanaEditorService.removePanels(this.id, rowIndex).subscribe(response => {
            if (response.success) {
                this.notyService.genericSuccess(
                    this.TranslocoService.translate('Row removed successfully')
                );

                if (this.data) {
                    this.data.userdashboardData.rows.splice(rowIndex, 1);
                }
                this.cdr.markForCheck();
            } else {
                this.notyService.genericError(
                    this.TranslocoService.translate('Error while removing row')
                );
            }
        }));
    }

    /**
     * Handle events from child components when a new panel should be added to a row
     * @param rowIndex
     */
    public onCreatePanelEvent(rowIndex: number) {
        if (!this.data) {
            return;
        }

        const post: CreatePanelPost = {
            GrafanaUserdashboardPanel: {
                userdashboard_id: this.data.userdashboardData.id,
                row: rowIndex,
                visualization_type: GrafanaChartTypesEnum.timeseries,
            }
        };

        this.subscriptions.add(this.GrafanaEditorService.createPanel(post).subscribe(response => {
            if (response.success) {
                this.notyService.genericSuccess(
                    this.TranslocoService.translate('Panel added successfully')
                );

                if (this.data) {
                    const panel = response.data as GrafanaEditorDashboardRow;
                    this.data.userdashboardData.rows[rowIndex].push(panel);
                }

                if (this.data) {
                    // Clone the data to trigger change detection
                    // Maybe we have to "refactor" this with JSON.parse(JSON.stringify(this.data.userdashboardData.rows))
                    // like we did 3000 years ago
                    // https://stackoverflow.com/questions/78710886/js-structuredclone-not-truly-deep-copy
                    this.data.userdashboardData.rows = structuredClone(this.data.userdashboardData.rows);
                }

                this.cdr.markForCheck();
            } else {
                this.notyService.genericError(
                    this.TranslocoService.translate('Error while adding panel')
                );
            }
        }));
    }

    public synchronizeWithGrafana() {
        if (!this.data) {
            return;
        }

        // Pass selection to the modal
        this.selectedItems = [
            {
                id: this.data.userdashboardData.id,
                displayName: this.data.userdashboardData.name
            }
        ];

        this.cdr.markForCheck();

        // open modal
        this.modalService.toggle({
            show: true,
            id: 'synchronizeGrafanaModal',
        });
    }


}
