import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IndexPage } from '../../../../../pages.interface';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { PrometheusExportersService } from '../prometheus-exporters.service';
import {
    Exporter,
    getDefaultPrometheusExportersIndexParams,
    PrometheusExportersIndex,
    PrometheusExportersIndexParams
} from '../prometheus-exporters.interface';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';

import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';

@Component({
    selector: 'oitc-prometheus-exporters-index',
    standalone: true,
    imports: [
        RouterLink,
        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        NavComponent,
        NavItemComponent,
        CardBodyComponent,
        XsButtonDirective,
        PermissionDirective,
        TranslocoDirective,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        FormDirective,
        FormsModule,
        RowComponent,
        DebounceDirective,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TranslocoPipe,
        MultiSelectComponent,
        TableLoaderComponent,
        MatSort,
        MatSortHeader,
        TableDirective,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        DeleteAllModalComponent,
        DropdownDividerDirective
    ],
    templateUrl: './prometheus-exporters-index.component.html',
    styleUrl: './prometheus-exporters-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: PrometheusExportersService}
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrometheusExportersIndexComponent implements OnInit, OnDestroy, IndexPage {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly PrometheusExportersService: PrometheusExportersService = inject(PrometheusExportersService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected intervals: SelectKeyValueString[] = [
        {key: "15s", value: "15 seconds"},
        {key: "30s", value: "30 seconds"},
        {key: "1m", value: "1 minute"},
        {key: "90s", value: "1 minute 30 seconds"},
        {key: "2m", value: "2 minutes"},
        {key: "5m", value: "5 minutes"},
        {key: "10m", value: "10 minutes"},
        {key: "30m", value: "30 minutes"},
        {key: "1h", value: "1 hour"}
    ];

    protected params: PrometheusExportersIndexParams = getDefaultPrometheusExportersIndexParams();
    protected selectedItems: DeleteAllItem[] = [];
    protected result?: PrometheusExportersIndex;
    protected hideFilter: boolean = true;

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public ngOnInit(): void {
        this.load();
    }

    public onFilterChange(event: any): void {
        this.params.page = 1;
        this.load();
    }

    public onMassActionComplete(success: boolean): void {
        this.load();
    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.load();
    }

    public onSortChange(sort: Sort): void {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.load();
        }
    }

    public resetFilter(): void {
        this.params = getDefaultPrometheusExportersIndexParams();

        this.load();
    }

    public toggleFilter(): void {
        this.hideFilter = !this.hideFilter;
    }

    protected load(): void {
        this.subscriptions.add(this.PrometheusExportersService.getIndex(this.params)
            .subscribe((result: PrometheusExportersIndex) => {
                this.cdr.markForCheck();
                this.result = result;
            })
        );
    }


    // Open the Delete All Modal

    public toggleDeleteAllModal(exporter: Exporter) {
        let items: DeleteAllItem[] = [];

        // User just want to delete a single contact
        items = [
            {
                id: exporter.id as number,
                displayName: exporter.name
            }
        ];

        // Pass selection to the modal
        this.selectedItems = items;
        this.cdr.markForCheck();

        // open modal
        this.modalService.toggle({
            show: true,
            id: 'deleteAllModal',
        });
    }
}
