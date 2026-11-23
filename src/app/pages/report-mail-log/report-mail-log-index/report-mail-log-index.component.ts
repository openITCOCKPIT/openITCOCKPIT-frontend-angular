import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
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
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { IndexPage } from '../../../pages.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { DebounceDirective } from '../../../directives/debounce.directive';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { ReportMailLogService } from '../report-mail-log.service';
import {
    ReportMailLogRecipientsComponent
} from '../../../components/report-mail-log/report-mail-log-recipients/report-mail-log-recipients.component';
import {
    getDefaultReportMailLogIndexParams,
    REPORT_MAIL_LOG_EDIT_ROUTES,
    ReportMailLogIndexParams,
    ReportMailLogIndexRoot
} from '../report-mail-log.interface';

@Component({
    selector: 'oitc-report-mail-log-index',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        LabelLinkComponent,
        MatSort,
        MatSortHeader,
        NavComponent,
        NavItemComponent,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        ReportMailLogRecipientsComponent,
        RouterLink,
        RowComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective
    ],
    templateUrl: './report-mail-log-index.component.html',
    styleUrl: './report-mail-log-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportMailLogIndexComponent implements OnInit, OnDestroy, IndexPage {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly route = inject(ActivatedRoute);
    private readonly ReportMailLogService = inject(ReportMailLogService);
    private readonly cdr = inject(ChangeDetectorRef);

    public readonly editRoutes = REPORT_MAIL_LOG_EDIT_ROUTES;

    public hideFilter: boolean = true;
    public params: ReportMailLogIndexParams = getDefaultReportMailLogIndexParams();
    public mailLog?: ReportMailLogIndexRoot;

    public from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
    public to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');

    // Selected report types, e.g. {instantreport: true, sla: false}. Nothing selected = all types
    public reportTypeFilter: { [reportType: string]: boolean } = {};

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(() => {
            this.load();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.params['filter[from]'] = formatDate(new Date(this.from), 'dd.MM.y HH:mm', 'en-US');
        this.params['filter[to]'] = formatDate(new Date(this.to), 'dd.MM.y HH:mm', 'en-US');

        this.params['filter[ReportMailLog.report_type][]'] = Object.keys(this.reportTypeFilter)
            .filter((reportType: string) => this.reportTypeFilter[reportType]);

        this.subscriptions.add(this.ReportMailLogService.getIndex(this.params)
            .subscribe((result) => {
                this.mailLog = result;
                this.cdr.markForCheck();
            })
        );
    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.load();
    }

    public onFilterChange($event: any): void {
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

    public toggleFilter(): void {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter(): void {
        this.params = getDefaultReportMailLogIndexParams();
        this.from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.reportTypeFilter = {};
        this.load();
    }

    public onMassActionComplete(success: boolean): void {
    }
}
