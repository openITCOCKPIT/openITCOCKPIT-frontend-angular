import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    AlertComponent,
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
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { IndexPage } from '../../../../../pages.interface';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { PaginateOrScrollComponent } from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import { ActionsButtonElementComponent } from '../../../../../components/actions-button-element/actions-button-element.component';
import { CvesService } from '../cves.service';
import { CveColor, CvesIndexParams, CvesIndexRoot, CvesSummary, getDefaultCvesIndexParams } from '../cves.interface';
import { CveStateBadgeComponent } from '../../../components/cve-state-badge/cve-state-badge.component';
import { CveSeverityBarComponent } from '../../../components/cve-severity-bar/cve-severity-bar.component';
import { CvesTrendChartComponent } from '../../../components/cves-trend-chart/cves-trend-chart.component';
import { CvesPagesNavComponent } from '../../../components/cves-pages-nav/cves-pages-nav.component';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';

@Component({
    selector: 'oitc-cves-index',
    imports: [
        RouterLink,
        FormsModule,
        MatSort,
        MatSortHeader,
        TranslocoDirective,
        TranslocoPipe,
        FaIconComponent,
        AlertComponent,
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
        MultiSelectComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        CveStateBadgeComponent,
        CveSeverityBarComponent,
        CvesTrendChartComponent,
        CvesPagesNavComponent,
        NavComponent,
        TrueFalseDirective
    ],
    templateUrl: './cves-index.component.html',
    styleUrl: './cves-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvesIndexComponent implements OnInit, OnDestroy, IndexPage {
    private readonly route = inject(ActivatedRoute);
    private readonly CvesService = inject(CvesService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly cdr = inject(ChangeDetectorRef);
    private subscriptions: Subscription = new Subscription();

    public params: CvesIndexParams = getDefaultCvesIndexParams();
    public hideFilter: boolean = true;
    public hosts?: CvesIndexRoot;
    public summary?: CvesSummary;

    // Filter by the result of the last evaluation, a stale host keeps its last color
    public readonly colors: { key: CveColor, value: string, color: string }[] = [
        {key: 'red', value: this.TranslocoService.translate('Red'), color: 'danger'},
        {key: 'yellow', value: this.TranslocoService.translate('Yellow'), color: 'warning'},
        {key: 'green', value: this.TranslocoService.translate('Green'), color: 'success'},
        {key: 'gray', value: this.TranslocoService.translate('Gray'), color: 'secondary'}
    ];

    public readonly statuses: SelectKeyValueString[] = [
        {key: 'complete', value: this.TranslocoService.translate('Evaluated')},
        {key: 'partial', value: this.TranslocoService.translate('Partially evaluated')},
        {key: 'not_evaluable', value: this.TranslocoService.translate('Not evaluable')},
        {key: 'failed', value: this.TranslocoService.translate('Evaluation failed')}
    ];

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // e.g. links from the tiles or a dashboard: ?color=red
            const color = params['color'];
            if (color) {
                this.params['filter[CveHostSummaries.color][]'] = [].concat(color);
            }
            if (params['kev']) {
                this.params['filter[CveHostSummaries.kev_count]'] = 1;
            }
            this.load();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.subscriptions.add(this.CvesService.getIndex(this.params).subscribe((result) => {
            this.hosts = result;
            this.cdr.markForCheck();
        }));
        this.subscriptions.add(this.CvesService.getSummary().subscribe((result) => {
            this.summary = result.summary;
            this.cdr.markForCheck();
        }));
    }

    public toggleFilter(): void {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter(): void {
        this.params = getDefaultCvesIndexParams();
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

    public isColorSelected(color: CveColor): boolean {
        return this.params['filter[CveHostSummaries.color][]'].includes(color);
    }

    public toggleColor(color: CveColor): void {
        const colors = this.params['filter[CveHostSummaries.color][]'];
        this.params['filter[CveHostSummaries.color][]'] = colors.includes(color) ? colors.filter(c => c !== color) : [...colors, color];
        this.onFilterChange(null);
    }


    public hostsWithState(color: CveColor): number {
        return this.summary?.hosts.colors[color] ?? 0;
    }
}
