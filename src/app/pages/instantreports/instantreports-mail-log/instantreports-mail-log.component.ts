import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Sort } from '@angular/material/sort';
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
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { IndexPage } from '../../../pages.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { DebounceDirective } from '../../../directives/debounce.directive';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { InstantreportsService } from '../instantreports.service';
import { InstantreportsMailLogRoot } from '../instantreports.interface';
import {
    getDefaultReportMailLogParams,
    ReportMailLogParams
} from '../../../components/report-mail-log/report-mail-log.interface';
import {
    ReportMailLogTableComponent
} from '../../../components/report-mail-log/report-mail-log-table/report-mail-log-table.component';

@Component({
    selector: 'oitc-instantreports-mail-log',
    imports: [
        BackButtonDirective,
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
        NavComponent,
        NavItemComponent,
        PaginateOrScrollComponent,
        PermissionDirective,
        ReportMailLogTableComponent,
        RouterLink,
        RowComponent,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective
    ],
    templateUrl: './instantreports-mail-log.component.html',
    styleUrl: './instantreports-mail-log.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstantreportsMailLogComponent implements OnInit, OnDestroy, IndexPage {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly route = inject(ActivatedRoute);
    private readonly InstantreportsService = inject(InstantreportsService);
    private readonly cdr = inject(ChangeDetectorRef);

    private instantreportId: number = 0;

    public hideFilter: boolean = true;
    public params: ReportMailLogParams = getDefaultReportMailLogParams();
    public mailLog?: InstantreportsMailLogRoot;

    public from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
    public to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');
    public hasBeenSentFilter = {
        sent: false,
        failed: false
    };

    public ngOnInit(): void {
        this.instantreportId = Number(this.route.snapshot.paramMap.get('id'));
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

        // Only filter if exactly one of both checkboxes is selected
        this.params['filter[ReportMailLog.has_been_sent]'] = '';
        if (this.hasBeenSentFilter.sent && !this.hasBeenSentFilter.failed) {
            this.params['filter[ReportMailLog.has_been_sent]'] = '1';
        }
        if (this.hasBeenSentFilter.failed && !this.hasBeenSentFilter.sent) {
            this.params['filter[ReportMailLog.has_been_sent]'] = '0';
        }

        this.subscriptions.add(this.InstantreportsService.getMailLog(this.instantreportId, this.params)
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
        this.params = getDefaultReportMailLogParams();
        this.from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.hasBeenSentFilter = {
            sent: false,
            failed: false
        };
        this.load();
    }

    public onMassActionComplete(success: boolean): void {
    }
}
