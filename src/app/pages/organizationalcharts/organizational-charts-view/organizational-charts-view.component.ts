import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import {
    CardBodyComponent,
    CardComponent, CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    NavComponent,
    NavItemComponent
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
        CardFooterComponent
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
    public organizationalCharts?: SelectKeyValue[];


    public ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.route.queryParams.subscribe(params => {
            this.organizationalCharts = [];
            if( id){
                // Process all query params first and then trigger the load function
                this.subscriptions.add(this.OrganizationalChartsService.getOrganizationalChartsByContainerId(id)
                    .subscribe((result) => {
                        this.organizationalCharts = result;
                        this.cdr.markForCheck();

                        // Update the title.
                        //let newTitle: string = this.containers.breadcrumbs[this.containers.breadcrumbs.length - 1].value;
                        //this.TitleService.setTitle(`${newTitle} | ` + this.TranslocoService.translate('Organizational charts'));
                    })
                );


                this.cdr.markForCheck();
            }


        });

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
}
