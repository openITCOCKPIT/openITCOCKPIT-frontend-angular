import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IndexPage } from '../../../pages.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import {
    getDefaultInstantreportEvaluationTypesFilter,
    getDefaultInstantreportsIndexObjectTypesFilter,
    getDefaultInstantreportsIndexParams,
    InstantreportEvaluationTypesFilter,
    InstantreportsIndexObjectTypesFilter,
    InstantreportsIndexParams
} from '../instantreports.interface';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import _ from 'lodash';

@Component({
    selector: 'oitc-instantreports-index',
    standalone: true,
    imports: [],
    templateUrl: './instantreports-index.component.html',
    styleUrl: './instantreports-index.component.css'
})
export class InstantreportsIndexComponent implements OnInit, OnDestroy, IndexPage {

    public hideFilter: boolean = true;
    public params: InstantreportsIndexParams = getDefaultInstantreportsIndexParams();
    public objectTypesFilter: InstantreportsIndexObjectTypesFilter = getDefaultInstantreportsIndexObjectTypesFilter()
    public evaluationTypesFilter: InstantreportEvaluationTypesFilter = getDefaultInstantreportEvaluationTypesFilter()

    private subscriptions: Subscription = new Subscription();
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);


    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public toggleFilter(): void {
        this.hideFilter = !this.hideFilter;
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
        this.params = getDefaultInstantreportsIndexParams();
        this.objectTypesFilter = getDefaultInstantreportsIndexObjectTypesFilter()
        this.evaluationTypesFilter = getDefaultInstantreportEvaluationTypesFilter()

        this.loadInstantreports();
    }

    public loadInstantreports(): void {
        this.params['filter[Instantreports.type][]'] = Object.keys(_.pickBy(this.objectTypesFilter, (value, key) => value === true));
        this.params['filter[Instantreports.evaluation][]'] = Object.keys(_.pickBy(this.evaluationTypesFilter, (value, key) => value === true));

    }


}
