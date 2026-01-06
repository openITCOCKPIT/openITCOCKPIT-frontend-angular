import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { IndexPage } from '../../../../../pages.interface';
import { Subscription } from 'rxjs';
import { SatellitesService } from '../satellites.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import {
    getDefaultSatellitesInformationParams,
    SatelliteInfoIndex,
    SatellitesInformationParams
} from '../satellites.interface';
import { Sort } from '@angular/material/sort';

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
        CardHeaderComponent
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
