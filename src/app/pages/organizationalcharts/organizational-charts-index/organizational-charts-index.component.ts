import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    OrganizationalChartsEditorComponent
} from '../organizational-charts-editor/organizational-charts-editor.component';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ModalService
} from '@coreui/angular';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { IndexPage } from '../../../pages.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { Sort } from '@angular/material/sort';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationalChartsService } from '../organizationalcharts.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import {
    getDefaultOrganizationalChartsIndexParams,
    OrganizationalChartsIndexParams,
    OrganizationalChartsIndexRoot
} from '../organizationalcharts.interface';

@Component({
    selector: 'oitc-organizational-charts-index',
    imports: [
        OrganizationalChartsEditorComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        TranslocoDirective
    ],
    templateUrl: './organizational-charts-index.component.html',
    styleUrl: './organizational-charts-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationalChartsIndexComponent implements OnInit, OnDestroy, IndexPage {
    public params: OrganizationalChartsIndexParams = getDefaultOrganizationalChartsIndexParams()
    public organizationalcharts?: OrganizationalChartsIndexRoot;
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly OrganizationalChartsService = inject(OrganizationalChartsService);
    private readonly SelectionServiceService = inject(SelectionServiceService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly modalService = inject(ModalService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            this.loadOrganizationalCharts();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadOrganizationalCharts(): void {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(
            this.OrganizationalChartsService.getIndex(this.params).subscribe((organizationalcharts) => {
                this.organizationalcharts = organizationalcharts;
                this.cdr.markForCheck();
            })
        );
    }

    public onFilterChange(event: Event): void {
    }

    public onMassActionComplete(success: boolean): void {
    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
    }

    public onSortChange(sort: Sort): void {
    }

    public resetFilter(): void {
    }

    public toggleFilter(): void {
    }

}
