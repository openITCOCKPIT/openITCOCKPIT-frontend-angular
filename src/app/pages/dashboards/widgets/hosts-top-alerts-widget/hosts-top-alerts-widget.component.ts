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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    HostsTopAlertsWidgetConfig,
    HostsTopAlertsWidgetParams,
    HostTopAlertsRootResponse
} from './hosts-top-alerts-widget.interface';
import { HostsTopAlertsService } from './hosts-top-alerts.service';
import {
    BadgeComponent,
    ColComponent,
    ContainerComponent,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent,
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { AsyncPipe, NgClass } from '@angular/common';
import { NoRecordsComponent } from '../../../../layouts/coreui/no-records/no-records.component';
import { ScrollIndexComponent } from '../../../../layouts/coreui/paginator/scroll-index/scroll-index.component';
import { TableLoaderComponent } from '../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { HoststatusSimpleIconComponent } from '../../../hosts/hoststatus-simple-icon/hoststatus-simple-icon.component';
import { RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { SliderTimeComponent } from '../../../../components/slider-time/slider-time.component';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'oitc-hosts-top-alerts-widget',
    imports: [
    FaIconComponent,
    ColComponent,
    ContainerComponent,
    NoRecordsComponent,
    RowComponent,
    ScrollIndexComponent,
    TableDirective,
    TableLoaderComponent,
    HoststatusSimpleIconComponent,
    AsyncPipe,
    RouterLink,
    TranslocoDirective,
    NgClass,
    SliderTimeComponent,
    TranslocoPipe,
    XsButtonDirective,
    TooltipDirective,
    FormsModule,
    BadgeComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    DropdownComponent,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective
],
    templateUrl: './hosts-top-alerts-widget.component.html',
    styleUrl: './hosts-top-alerts-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostsTopAlertsWidgetComponent extends BaseWidgetComponent implements AfterViewInit {
    protected flipped = signal<boolean>(false);
    @ViewChild('boxContainer') boxContainer?: ElementRef;

    public hostAlerts?: HostTopAlertsRootResponse;

    private scrollIntervalId: any = null;

    // Limit of records to show - will be calculated depending on the height of the widget
    public limit: number = 1;
    public currentPage: number = 1;
    public widgetHeight: number = 0;


    // widget config will be loaded from the server
    public config?: HostsTopAlertsWidgetConfig;


    private readonly HostsTopAlertsService = inject(HostsTopAlertsService);


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

        let height = this.widgetHeight - 48 - 54 - 37 - 20 - 20; //Unit: px
        //                                        ^ Widget play/pause div
        //                                             ^ Paginator
        //                                                  ^ Table header
        //                                                       ^ Some paddings and margins
        //                                                            ^ Alert status bar

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
            if (this.hostAlerts && this.hostAlerts.scroll && this.hostAlerts.scroll.hasNextPage) {
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

        this.subscriptions.add(this.HostsTopAlertsService.loadWidgetConfig(this.widget.id).subscribe(config => {
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

        this.subscriptions.add(this.HostsTopAlertsService.saveWidgetConfig(this.widget.id, this.config).subscribe((response) => {
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

        // Apply the config to the filter
        const params: HostsTopAlertsWidgetParams = {
            angular: true,
            scroll: true,
            page: this.currentPage,
            limit: this.limit,
            'filter[NotificationHosts.state][]': [this.config.state],
            'filter[not_older_than]': this.getOlderThanInMinutes(),
        };

        this.subscriptions.add(this.HostsTopAlertsService.loadHostTopAlerts(params).subscribe(alerts => {
            this.hostAlerts = alerts;
            this.cdr.markForCheck();
        }));
    }

    private getOlderThanInMinutes(): number {
        if (!this.config) {
            return 60;
        }

        switch (this.config.not_older_than_unit) {
            case 'MINUTE':
                return this.config.not_older_than;

            case 'HOUR':
                return this.config.not_older_than * 60;
            case 'DAY':
                return this.config.not_older_than * 60 * 24;
            default:
                return this.config.not_older_than;
        }
    }

    public onPaginatorChange(page: number): void {
        this.currentPage = page;
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
