import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AutomapsService } from '../automaps.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { IndexPage } from '../../../pages.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { Sort } from '@angular/material/sort';

@Component({
    selector: 'oitc-automaps-index',
    standalone: true,
    imports: [],
    templateUrl: './automaps-index.component.html',
    styleUrl: './automaps-index.component.css'
})
export class AutomapsIndexComponent implements OnInit, OnDestroy, IndexPage {

    private subscriptions: Subscription = new Subscription();
    private AutomapsService = inject(AutomapsService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);


    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            this.loadAutomaps();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
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

    public loadAutomaps() {

    }

}
