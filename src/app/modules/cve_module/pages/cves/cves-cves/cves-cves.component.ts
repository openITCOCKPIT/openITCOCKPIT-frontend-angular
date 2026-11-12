import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavItemComponent,
    RowComponent,
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { IndexPage } from '../../../../../pages.interface';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { CvesService } from '../cves.service';
import { CvesCvesParams, CvesCvesRoot, getDefaultCvesCvesParams } from '../cves.interface';
import { CveSeverityBadgeComponent } from '../../../components/cve-severity-badge/cve-severity-badge.component';
import { CvesPagesNavComponent } from '../../../components/cves-pages-nav/cves-pages-nav.component';

/**
 * Open CVEs across all hosts the user may see
 */
@Component({
    selector: 'oitc-cves-cves',
    imports: [
        RouterLink,
        DecimalPipe,
        FormsModule,
        MatSort,
        MatSortHeader,
        TranslocoDirective,
        TranslocoPipe,
        FaIconComponent,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        NavItemComponent,
        RowComponent,
        TableDirective,
        TooltipDirective,
        PaginateOrScrollComponent,
        TableLoaderComponent,
        NoRecordsComponent,
        DebounceDirective,
        XsButtonDirective,
        CveSeverityBadgeComponent,
        CvesPagesNavComponent
    ],
    templateUrl: './cves-cves.component.html',
    styleUrl: './cves-cves.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvesCvesComponent implements OnInit, OnDestroy, IndexPage {
    private readonly CvesService = inject(CvesService);
    private readonly cdr = inject(ChangeDetectorRef);
    private subscriptions: Subscription = new Subscription();

    public params: CvesCvesParams = getDefaultCvesCvesParams();
    public hideFilter: boolean = true;
    public cves?: CvesCvesRoot;

    public ngOnInit(): void {
        this.load();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.subscriptions.add(this.CvesService.getCves(this.params).subscribe((result) => {
            this.cves = result;
            this.cdr.markForCheck();
        }));
    }

    public toggleFilter(): void {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter(): void {
        this.params = getDefaultCvesCvesParams();
        this.load();
    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.load();
    }

    public onFilterChange(event: any): void {
        this.params.page = 1;
        this.load();
    }

    public onSortChange(sort: Sort): void {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.load();
        }
    }

    public onMassActionComplete(success: boolean): void {
        if (success) {
            this.load();
        }
    }

    public toggleKevOnly(enabled: boolean): void {
        this.params['filter[Cves.kev_cisa]'] = enabled ? 1 : '';
        this.onFilterChange(null);
    }
}
