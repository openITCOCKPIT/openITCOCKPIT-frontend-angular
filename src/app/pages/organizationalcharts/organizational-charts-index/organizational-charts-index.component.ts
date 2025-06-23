import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import {
    OrganizationalChartsEditorComponent
} from '../organizational-charts-editor/organizational-charts-editor.component';
import { CardBodyComponent, CardComponent, CardHeaderComponent, CardTitleDirective } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { IndexPage } from '../../../pages.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { Sort } from '@angular/material/sort';

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
    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
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
