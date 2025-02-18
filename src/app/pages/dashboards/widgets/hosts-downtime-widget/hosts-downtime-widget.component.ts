import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    signal,
    ViewChild
} from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { NgForOf, NgIf } from '@angular/common';
import {
    ColComponent,
    ContainerComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { DowntimeSimpleIconComponent } from '../../../downtimes/downtime-simple-icon/downtime-simple-icon.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NoRecordsComponent } from '../../../../layouts/coreui/no-records/no-records.component';
import { TableLoaderComponent } from '../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DowntimeHostIndexRoot } from '../../../downtimes/downtimes.interface';
import { HostsDowntimeWidgetService } from './hosts-downtime-widget.service';
import { HostDowntimeWidgetParams, HostsDowntimeWidgetConfig } from './hosts-downtime-widget.interface';
import { LabelLinkComponent } from '../../../../layouts/coreui/label-link/label-link.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ScrollIndexComponent } from '../../../../layouts/coreui/paginator/scroll-index/scroll-index.component';


@Component({
    selector: 'oitc-hosts-downtime-widget',
    imports: [
        ColComponent,
        ContainerComponent,
        DowntimeSimpleIconComponent,
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        MatSort,
        MatSortHeader,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        ReactiveFormsModule,
        RowComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        LabelLinkComponent,
        ScrollIndexComponent
    ],
    templateUrl: './hosts-downtime-widget.component.html',
    styleUrl: './hosts-downtime-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('flip', [
            state('false', style({transform: 'none'})),
            state('true', style({transform: 'rotateY(180deg)'})),
            transition('false <=> true', animate('0.8s ease-in-out'))
        ])
    ]
})
export class HostsDowntimeWidgetComponent extends BaseWidgetComponent implements AfterViewInit {
    protected flipped = signal<boolean>(false);
    @ViewChild('boxContainer') boxContainer?: ElementRef;

    public hostDowntimes?: DowntimeHostIndexRoot;

    private scrollIntervalId: any = null;

    // Limit of records to show - will be calculated depending on the height of the widget
    public limit: number = 1;
    public currentPage: number = 1;
    public widgetHeight: number = 0;


    // widget config will be loaded from the server
    public config?: HostsDowntimeWidgetConfig;


    private readonly HostsDowntimeWidgetService = inject(HostsDowntimeWidgetService);

    public override load() {
        this.loadWidgetConfig();


    }

    public ngAfterViewInit(): void {
        // Set initial limit on load
        this.setLimit();
    }

    public override ngOnDestroy() {
        this.stopScroll();
        super.ngOnDestroy();
    }

    public override resizeWidget(event?: KtdResizeEnd) {
        this.setLimit();
        this.loadDowntimes();
    }

    private setLimit() {
        let editButtonHeight = 30;
        if (this.isReadonly()) {
            //edit button is not visible
            editButtonHeight = 0;
        }
        this.widgetHeight = this.boxContainer?.nativeElement.offsetHeight - editButtonHeight; //21px height of button + padding

        let height = this.widgetHeight - 42 - 54 - 37; //Unit: px
        //                                        ^ Widget play/pause div
        //                                             ^ Paginator
        //                                                  ^ Table header

        let limit = Math.floor(height / 36); // 36px = table row height;
        if (limit <= 0) {
            limit = 1;
        }

        this.limit = limit;
    }

    public override layoutUpdate(event: KtdGridLayout) {

    }

    public startScroll() {

    }

    public stopScroll() {
        if (this.scrollIntervalId) {
            clearInterval(this.scrollIntervalId);
            this.scrollIntervalId = null;
        }
    }

    public loadWidgetConfig() {
        if (!this.widget) {
            return;
        }

        this.subscriptions.add(this.HostsDowntimeWidgetService.loadWidgetConfig(this.widget.id).subscribe(config => {
            // Save the widget config
            this.config = config;
            this.loadDowntimes();
            this.cdr.markForCheck();
        }));
    }

    public saveWidgetConfig(): void {
        if (!this.widget || !this.config) {
            return;
        }

        this.subscriptions.add(this.HostsDowntimeWidgetService.saveWidgetConfig(this.widget.id, this.config).subscribe((response) => {
            // Close config
            this.flipped.set(false);

            // Reload the downtimes
            this.loadDowntimes();
        }));
    }

    public loadDowntimes(): void {
        if (!this.config) {
            return;
        }

        let wasCancelled: '' | boolean = '';
        if (this.config.DowntimeHost.was_cancelled != this.config.DowntimeHost.was_not_cancelled) {
            wasCancelled = this.config.DowntimeHost.was_cancelled;
        }

        // Apply the config to the filter
        const params: HostDowntimeWidgetParams = {
            angular: true,
            sort: this.config.sort,
            direction: this.config.direction,
            scroll: this.config.useScroll,
            page: this.currentPage,
            limit: this.limit,
            'filter[DowntimeHosts.comment_data]': this.config.DowntimeHost.comment_data,
            'filter[DowntimeHosts.was_cancelled]': wasCancelled,
            'filter[Hosts.name]': this.config.Host.name,
            'filter[hideExpired]': this.config.hideExpired ? 1 : 0,
            'filter[isRunning]': this.config.isRunning ? 1 : 0,
        };

        this.subscriptions.add(this.HostsDowntimeWidgetService.loadDowntimes(params).subscribe(downtimes => {
            this.hostDowntimes = downtimes;
            this.cdr.markForCheck();
        }));
    }

    public onPaginatorChange(page: number): void {
        this.currentPage = page;
        this.loadDowntimes();
    }

    public onSortChange(sort: Sort): void {
        if (this.config) {
            // Save the new sort direction
            if (sort.direction === 'asc' || sort.direction === 'desc') {
                this.config.sort = sort.active;
                this.config.direction = sort.direction;
                this.saveWidgetConfig();
            }
        }
    }

}
