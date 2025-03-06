import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { IndexPage } from '../../../../../pages.interface';
import { Subscription } from 'rxjs';
import { getDefaultSatelliteTasksParams, SatelliteTasksIndex, SatelliteTasksParams } from '../satellites.interface';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { SatellitesService } from '../satellites.service';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    FormControlDirective,
    FormDirective,
    HeaderComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-satellites-tasks',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormsModule,
        HeaderComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        MatSort,
        MatSortHeader,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PermissionDirective,
        RowComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        BadgeComponent
    ],
    templateUrl: './satellites-tasks.component.html',
    styleUrl: './satellites-tasks.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SatellitesTasksComponent implements OnInit, OnDestroy, IndexPage {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly SatellitesService: SatellitesService = inject(SatellitesService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);

    protected params: SatelliteTasksParams = getDefaultSatelliteTasksParams();
    protected hideFilter: boolean = true;
    protected readonly statusOptions: SelectKeyValue[] = [
        {key: 0, value: this.TranslocoService.translate('Unknown')},
        {key: 1, value: this.TranslocoService.translate('Queued')},
        {key: 2, value: this.TranslocoService.translate('Running')},
        {key: 4, value: this.TranslocoService.translate('Success')},
        {key: 8, value: this.TranslocoService.translate('Failed')},
        {key: 16, value: this.TranslocoService.translate('Aborted')},
    ];
    protected result: SatelliteTasksIndex = {
        all_satellite_tasks: []
    } as SatelliteTasksIndex;

    public reload() {
        this.subscriptions.add(this.SatellitesService.getTasksIndex(this.params)
            .subscribe((result: SatelliteTasksIndex) => {
                this.result = result;
                this.cdr.markForCheck();
            }));
    }

    public ngOnInit() {
        this.reload();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }


    // Callback when a filter has changed
    public onFilterChange(event: any) {
        this.params.page = 1;
        this.reload();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.reload();
    }

    public resetFilter() {
        this.params = getDefaultSatelliteTasksParams();
        this.reload();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.reload();
        }
    }

    public onMassActionComplete(success: boolean) {
    }
}

