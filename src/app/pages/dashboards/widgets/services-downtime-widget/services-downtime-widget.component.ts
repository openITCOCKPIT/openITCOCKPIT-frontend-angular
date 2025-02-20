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
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { DowntimeSimpleIconComponent } from '../../../downtimes/downtime-simple-icon/downtime-simple-icon.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { LabelLinkComponent } from '../../../../layouts/coreui/label-link/label-link.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../../layouts/coreui/no-records/no-records.component';
import { ScrollIndexComponent } from '../../../../layouts/coreui/paginator/scroll-index/scroll-index.component';
import { SliderTimeComponent } from '../../../../components/slider-time/slider-time.component';
import { TableLoaderComponent } from '../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DowntimeServiceIndexRoot } from '../../../downtimes/downtimes.interface';
import { ServicesDowntimeWidgetService } from './services-downtime-widget.service';
import { ServiceDowntimeWidgetParams, ServicesDowntimeWidgetConfig } from './services-downtime-widget.interface';

@Component({
    selector: 'oitc-services-downtime-widget',
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
        LabelLinkComponent,
        MatSort,
        MatSortHeader,
        NgIf,
        NoRecordsComponent,
        RowComponent,
        ScrollIndexComponent,
        SliderTimeComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        TooltipDirective
    ],
    templateUrl: './services-downtime-widget.component.html',
    styleUrl: './services-downtime-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesDowntimeWidgetComponent extends BaseWidgetComponent implements AfterViewInit {
    protected flipped = signal<boolean>(false);
    @ViewChild('boxContainer') boxContainer?: ElementRef;

    public serviceDowntimes?: DowntimeServiceIndexRoot;

    private scrollIntervalId: any = null;

    // Limit of records to show - will be calculated depending on the height of the widget
    public limit: number = 1;
    public currentPage: number = 1;
    public widgetHeight: number = 0;


    // widget config will be loaded from the server
    public config?: ServicesDowntimeWidgetConfig;


    private readonly ServicesDowntimeWidgetService = inject(ServicesDowntimeWidgetService);

    public override load() {
        // Handled by ngAfterViewInit as we need the widget height for the correct limit
    }

    public ngAfterViewInit(): void {
        // Set initial limit on load
        this.setLimit();

        this.loadWidgetConfig();
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
        this.widgetHeight = this.boxContainer?.nativeElement.offsetHeight;

        let height = this.widgetHeight - 48 - 54 - 37 - 20; //Unit: px
        //                                        ^ Widget play/pause div
        //                                             ^ Paginator
        //                                                  ^ Table header
        //                                                       ^ Some paddings and margins

        let limit = Math.floor(height / 36); // 36px = table row height;
        if (limit <= 0) {
            limit = 1;
        }

        this.limit = limit;
    }

    public override layoutUpdate(event: KtdGridLayout) {

    }

    public startScroll() {
        if (this.config) {
            this.config.useScroll = true;
        }

        // Clear any old interval
        if (this.scrollIntervalId) {
            clearInterval(this.scrollIntervalId);
            this.scrollIntervalId = null;
        }

        let interval = 5000;
        if (this.config?.scroll_interval) {
            interval = this.config?.scroll_interval;
        }

        // Scroll to next page and load data
        this.scrollIntervalId = setInterval(() => {
            if (this.serviceDowntimes && this.serviceDowntimes.scroll && this.serviceDowntimes.scroll.hasNextPage) {
                this.currentPage++;
                this.loadDowntimes();
            } else {
                this.currentPage = 1;
                this.loadDowntimes();
            }
        }, interval);
    }

    public stopScroll() {
        if (this.config) {
            this.config.useScroll = false;
        }

        if (this.scrollIntervalId) {
            clearInterval(this.scrollIntervalId);
            this.scrollIntervalId = null;
        }
    }

    public loadWidgetConfig() {
        if (!this.widget) {
            return;
        }

        this.subscriptions.add(this.ServicesDowntimeWidgetService.loadWidgetConfig(this.widget.id).subscribe(config => {
            // Save the widget config
            this.config = config;
            this.loadDowntimes();
            this.cdr.markForCheck();

            if (this.config.useScroll) {
                this.startScroll();
            }

        }));
    }

    public saveWidgetConfig(): void {
        if (!this.widget || !this.config) {
            return;
        }

        this.subscriptions.add(this.ServicesDowntimeWidgetService.saveWidgetConfig(this.widget.id, this.config).subscribe((response) => {
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
        if (this.config.DowntimeService.was_cancelled != this.config.DowntimeService.was_not_cancelled) {
            wasCancelled = this.config.DowntimeService.was_cancelled;
        }

        // Apply the config to the filter
        const params: ServiceDowntimeWidgetParams = {
            angular: true,
            sort: this.config.sort,
            direction: this.config.direction,
            scroll: this.config.useScroll,
            page: this.currentPage,
            limit: this.limit,
            'filter[DowntimeServices.comment_data]': this.config.DowntimeService.comment_data,
            'filter[DowntimeServices.was_cancelled]': wasCancelled,
            'filter[Hosts.name]': this.config.Host.name,
            'filter[servicename]': this.config.Service.name,
            'filter[hideExpired]': this.config.hideExpired ? 1 : 0,
            'filter[isRunning]': this.config.isRunning ? 1 : 0,
        };

        this.subscriptions.add(this.ServicesDowntimeWidgetService.loadDowntimes(params).subscribe(downtimes => {
            this.serviceDowntimes = downtimes;
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
                if (!this.isReadonly()) {
                    this.saveWidgetConfig();
                }
            }
        }

        this.loadDowntimes();
    }

    public onIntervalSliderChanged() {
        if (!this.config || this.isReadonly()) {
            return;
        }

        if (this.config.scroll_interval === 0) {
            this.stopScroll();
        } else {
            this.startScroll();
        }

        // Save the new interval
        this.saveWidgetConfig();
    }
}
