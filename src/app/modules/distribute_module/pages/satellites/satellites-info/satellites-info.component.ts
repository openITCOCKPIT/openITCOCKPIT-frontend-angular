import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    ProgressComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { IndexPage } from '../../../../../pages.interface';
import { Subscription } from 'rxjs';
import { SatellitesService } from '../satellites.service';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import {
    getDefaultSatellitesInformationParams,
    SatelliteInfoIndex,
    SatellitesInformationParams
} from '../satellites.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { BadgeOutlineComponent } from '../../../../../layouts/coreui/badge-outline/badge-outline.component';
import { LocalNumberPipe } from '../../../../../pipes/local-number.pipe';

@Component({
    selector: 'oitc-satellites-info',
    imports: [
        CardTitleDirective,
        NavComponent,
        CardComponent,
        FaIconComponent,
        RouterLink,
        PermissionDirective,
        NavItemComponent,
        CardBodyComponent,
        XsButtonDirective,
        TranslocoDirective,
        CardHeaderComponent,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        MatSort,
        MatSortHeader,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        RowComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoPipe,
        BadgeOutlineComponent,
        ProgressComponent,
        LocalNumberPipe
    ],
    templateUrl: './satellites-info.component.html',
    styleUrl: './satellites-info.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SatellitesInfoComponent implements OnInit, OnDestroy, IndexPage {

    private readonly subscriptions: Subscription = new Subscription();
    private readonly SatellitesService: SatellitesService = inject(SatellitesService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);

    protected params: SatellitesInformationParams = getDefaultSatellitesInformationParams();
    protected hideFilter: boolean = true;

    public result?: SatelliteInfoIndex;

    public reload() {
        this.subscriptions.add(this.SatellitesService.getInformationIndex(this.params)
            .subscribe((result: SatelliteInfoIndex) => {
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
        this.params = getDefaultSatellitesInformationParams();
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
