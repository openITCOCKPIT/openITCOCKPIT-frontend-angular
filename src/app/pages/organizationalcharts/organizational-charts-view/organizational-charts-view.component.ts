import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import {
    QueryHandlerCheckerComponent
} from '../../../layouts/coreui/query-handler-checker/query-handler-checker.component';
import { NgClass } from '@angular/common';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { IndexPage } from '../../../pages.interface';
import { Subscription } from 'rxjs';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { Sort } from '@angular/material/sort';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { OrganizationalChartsService } from '../organizationalcharts.service';
import { HistoryService } from '../../../history.service';
import { TitleService } from '../../../services/title.service';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { GenericMessageResponse, GenericValidationError } from '../../../generic-responses';
import { OrganizationalChart } from '../organizationalcharts.interface';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { ContainerTypesEnum } from '../../changelogs/object-types.enum';
import { BrowsersContainer } from '../../browsers/browsers.interface';

@Component({
    selector: 'oitc-organizational-charts-view',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        BlockLoaderComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        QueryHandlerCheckerComponent,
        NavComponent,
        NavItemComponent,
        NgClass,
        CardBodyComponent,
        CardFooterComponent,
        SelectComponent,
        RowComponent,
        ColComponent,
        NoRecordsComponent
    ],
    templateUrl: './organizational-charts-view.component.html',
    styleUrl: './organizational-charts-view.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationalChartsViewComponent implements OnInit, OnDestroy, IndexPage {
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);
    private readonly OrganizationalChartsService: OrganizationalChartsService = inject(OrganizationalChartsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly TitleService: TitleService = inject(TitleService);
    public containerId: number = 0;
    public containers: BrowsersContainer[] = [];
    public organizationalCharts: SelectKeyValue[] = [];
    public organizationalchartId: number = 0;
    public organizationalChart?: OrganizationalChart;
    public title: string = '';

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            let id: number = params['containerId'] || 0;
            this.organizationalCharts = [];
            if (id) {
                this.containerId = id;
                // Process all query params first and then trigger the load function
                this.subscriptions.add(this.OrganizationalChartsService.getOrganizationalChartsByContainerId(id)
                    .subscribe((result) => {
                        this.organizationalCharts = result;
                        if (this.organizationalCharts[0]) {
                            this.organizationalchartId = this.organizationalCharts[0].key; // Default to the first organizational chart
                            this.title = this.organizationalCharts[0].value;
                        }
                        this.cdr.markForCheck();

                        // Update the title.
                        this.TitleService.setTitle(`${this.title} | ` + this.TranslocoService.translate('Organizational charts'));
                    })
                );

                this.cdr.markForCheck();
            }
        });

    }

    public onOrganizationalchartsChange() {
        if (this.organizationalchartId) {
            console.log('LOAD TREE FOR ORGANIZATIONAL CHARTS ID: ' + this.organizationalchartId);
            this.subscriptions.add(this.OrganizationalChartsService.getOrganizationalChartById(this.organizationalchartId)
                .subscribe((result) => {
                    if (result.success) {
                        const response = result.data as GenericMessageResponse;
                        this.organizationalChart = result.data.organizationalChart;
                        this.title = this.organizationalChart?.name || '';
                        this.TitleService.setTitle(`${this.title} | ` + this.TranslocoService.translate('Organizational charts'));

                        this.containers = result.data.containers;
                        this.cdr.markForCheck();
                        return;
                    }

                    // Error
                    const errorResponse = result.data as GenericValidationError;
                    this.notyService.genericError();


                    this.cdr.markForCheck();
                })
            );
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    toggleFilter(): void {
        throw new Error('Method not implemented.');
    }

    resetFilter(): void {
        throw new Error('Method not implemented.');
    }

    onPaginatorChange(change: PaginatorChangeEvent): void {
        throw new Error('Method not implemented.');
    }

    onFilterChange(event: Event): void {
        throw new Error('Method not implemented.');
    }

    onSortChange(sort: Sort): void {
        throw new Error('Method not implemented.');
    }

    onMassActionComplete(success: boolean): void {
        throw new Error('Method not implemented.');
    }

    protected readonly ContainerTypesEnum = ContainerTypesEnum;
}
