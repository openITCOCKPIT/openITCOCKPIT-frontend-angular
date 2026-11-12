import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    BadgeComponent,
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
    TableDirective
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
import {
    CvesRecommendationsParams,
    CvesRecommendationsRoot,
    getDefaultCvesRecommendationsParams
} from '../cves.interface';
import { CveSeverityBadgeComponent } from '../../../components/cve-severity-badge/cve-severity-badge.component';
import {
    CveRecommendationLabelComponent
} from '../../../components/cve-recommendation-label/cve-recommendation-label.component';
import { CvesPagesNavComponent } from '../../../components/cves-pages-nav/cves-pages-nav.component';

/**
 * What to do across all hosts, e.g. "update openssl fixes 12 CVEs on 8 hosts". Only findings that need action.
 */
@Component({
    selector: 'oitc-cves-recommendations',
    imports: [
        RouterLink,
        FormsModule,
        MatSort,
        MatSortHeader,
        TranslocoDirective,
        TranslocoPipe,
        FaIconComponent,
        BadgeComponent,
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
        PaginateOrScrollComponent,
        TableLoaderComponent,
        NoRecordsComponent,
        DebounceDirective,
        XsButtonDirective,
        CveSeverityBadgeComponent,
        CveRecommendationLabelComponent,
        CvesPagesNavComponent
    ],
    templateUrl: './cves-recommendations.component.html',
    styleUrl: './cves-recommendations.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvesRecommendationsComponent implements OnInit, OnDestroy, IndexPage {
    private readonly CvesService = inject(CvesService);
    private readonly cdr = inject(ChangeDetectorRef);
    private subscriptions: Subscription = new Subscription();

    public params: CvesRecommendationsParams = getDefaultCvesRecommendationsParams();
    public hideFilter: boolean = true;
    public recommendations?: CvesRecommendationsRoot;

    public ngOnInit(): void {
        this.load();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.subscriptions.add(this.CvesService.getRecommendations(this.params).subscribe((result) => {
            this.recommendations = result;
            this.cdr.markForCheck();
        }));
    }

    public toggleFilter(): void {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter(): void {
        this.params = getDefaultCvesRecommendationsParams();
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

    public toggleKernelOnly(enabled: boolean): void {
        this.params['filter[CveHostFindings.is_kernel]'] = enabled ? 1 : '';
        this.onFilterChange(null);
    }
}
