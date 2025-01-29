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
import { GrafanaEditorGetResponse } from './grafana-editor.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { GrafanaEditorService } from './grafana-editor.service';
import { HistoryService } from '../../../../../history.service';
import { GrafanaRowComponent } from './grafana-row/grafana-row.component';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    SynchronizeGrafanaModalComponent
} from '../../../components/synchronize-grafana-modal/synchronize-grafana-modal.component';


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
