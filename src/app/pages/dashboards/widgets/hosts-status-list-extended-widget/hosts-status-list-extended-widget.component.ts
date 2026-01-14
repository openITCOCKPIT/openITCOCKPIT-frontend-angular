import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    signal,
    ViewChild
} from '@angular/core';
import {
    AcknowledgementIconComponent
} from '../../../acknowledgements/acknowledgement-icon/acknowledgement-icon.component';
import { AsyncPipe } from '@angular/common';
import {
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
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent,
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { DowntimeIconComponent } from '../../../downtimes/downtime-icon/downtime-icon.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HoststatusIconComponent } from '../../../hosts/hoststatus-icon/hoststatus-icon.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NoRecordsComponent } from '../../../../layouts/coreui/no-records/no-records.component';
import {
    RegexHelperTooltipComponent
} from '../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { ScrollIndexComponent } from '../../../../layouts/coreui/paginator/scroll-index/scroll-index.component';
import { SliderTimeComponent } from '../../../../components/slider-time/slider-time.component';
import { TableLoaderComponent } from '../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { TrustAsHtmlPipe } from '../../../../pipes/trust-as-html.pipe';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { HostsIndexRoot } from '../../../hosts/hosts.interface';
import {
    HostsStatusListWidgetConfig,
    HostsStatusListWidgetParams
} from '../hosts-status-list-widget/hosts-status-list.interface';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { HostStatusNames } from '../../../hosts/hosts.enum';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { HostsStatusListWidgetService } from '../hosts-status-list-widget/hosts-status-list-widget.service';
import { RouterLink } from '@angular/router';
import { HostsBrowserModalService } from '../../../hosts/hosts-browser/hosts-browser-modal/hosts-browser-modal.service';

@Component({
    selector: 'oitc-hosts-status-list-extended-widget',
    imports: [
    AcknowledgementIconComponent,
    AsyncPipe,
    ColComponent,
    ContainerComponent,
    DowntimeIconComponent,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FaIconComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormsModule,
    HoststatusIconComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    MatSort,
    MatSortHeader,
    NgSelectComponent,
    NoRecordsComponent,
    ReactiveFormsModule,
    RegexHelperTooltipComponent,
    RowComponent,
    ScrollIndexComponent,
    SliderTimeComponent,
    TableDirective,
    TableLoaderComponent,
    TranslocoDirective,
    TranslocoPipe,
    TrustAsHtmlPipe,
    XsButtonDirective,
    TooltipDirective,
    RouterLink
],
    templateUrl: './hosts-status-list-extended-widget.component.html',
    styleUrl: './hosts-status-list-extended-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostsStatusListExtendedWidgetComponent extends BaseWidgetComponent implements AfterViewInit {

    // Basically this is the same widget as the HostsStatusListWidgetComponent, but with a modal to show more details

    protected flipped = signal<boolean>(false);
    @ViewChild('boxContainer') boxContainer?: ElementRef;

    public hosts?: HostsIndexRoot;

    private scrollIntervalId: any = null;

    // Limit of records to show - will be calculated depending on the height of the widget
    public limit: number = 1;
    public currentPage: number = 1;
    public widgetHeight: number = 0;


    // widget config will be loaded from the server
    public config?: HostsStatusListWidgetConfig;
    public configKeyWords: string[] = [];
    public configNotKeyWords: string[] = [];


    private readonly HostsStatusListWidgetService = inject(HostsStatusListWidgetService);
    private readonly HostsBrowserModalService = inject(HostsBrowserModalService);

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
        this.loadHosts();
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
            if (this.hosts && this.hosts.scroll && this.hosts.scroll.hasNextPage) {
                this.currentPage++;
                this.loadHosts();
            } else {
                this.currentPage = 1;
                this.loadHosts();
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

        this.configKeyWords = [];
        this.configNotKeyWords = [];

        this.subscriptions.add(this.HostsStatusListWidgetService.loadWidgetConfig(this.widget.id).subscribe(config => {
            // Save the widget config
            this.config = config;

            // "".split() returns [''] instead of [] like in php
            this.configKeyWords = (config.Host.keywords !== '') ? config.Host.keywords.split(',') : [];
            this.configNotKeyWords = (config.Host.not_keywords !== '') ? config.Host.not_keywords.split(',') : [];


            this.loadHosts();
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

        this.config.Host.keywords = this.configKeyWords.join(',');
        this.config.Host.not_keywords = this.configNotKeyWords.join(',');

        this.subscriptions.add(this.HostsStatusListWidgetService.saveWidgetConfig(this.widget.id, this.config).subscribe((response) => {
            // Close config
            this.flipped.set(false);

            // Reload the hosts
            this.loadHosts();
        }));
    }

    public loadHosts(): void {
        if (!this.config) {
            return;
        }

        let hasBeenAcknowledged: '' | boolean = '';
        if (this.config.Hoststatus.acknowledged != this.config.Hoststatus.not_acknowledged) {
            hasBeenAcknowledged = this.config.Hoststatus.acknowledged;
        }

        let inDowntime: '' | boolean = '';
        if (this.config.Hoststatus.in_downtime != this.config.Hoststatus.not_in_downtime) {
            inDowntime = this.config.Hoststatus.in_downtime;
        }

        // "".split() returns [''] instead of [] like in php
        const keyWordsForRequest = (this.config.Host.keywords !== '') ? this.config.Host.keywords.split(',') : [];
        const notKeyWordsForRequest = (this.config.Host.not_keywords !== '') ? this.config.Host.not_keywords.split(',') : [];

        let lastStateChange: [
                number | null,
                'SECOND' | 'MINUTE' | 'HOUR' | 'DAY' | null
        ] = [null, 'MINUTE'];
        if (this.config.Hoststatus.state_older_than && this.config.Hoststatus.state_older_than_unit && this.config.Hoststatus.state_older_than > 0) {
            lastStateChange = [
                this.config.Hoststatus.state_older_than, // Important, has to be array index 0 (see Filter.php)
                this.config.Hoststatus.state_older_than_unit // Important, has to be array index 1 (see Filter.php)
            ];
        }

        // currentState is an array of ['up', 'down', 'unreachable']
        let currentState: HostStatusNames[] = [];
        for (let key in this.config.Hoststatus.current_state) {
            const keyName = key as keyof typeof HostStatusNames;
            if (this.config.Hoststatus.current_state[keyName]) {
                currentState.push(
                    HostStatusNames[key as keyof typeof HostStatusNames]
                );
            }
        }

        // Apply the config to the filter
        const params: HostsStatusListWidgetParams = {
            angular: true,
            sort: this.config.sort,
            direction: this.config.direction,
            scroll: this.config.useScroll,
            page: this.currentPage,
            limit: this.limit,
            'filter[Hosts.name]': this.config.Host.name,
            'filter[Hosts.name_regex]': this.config.Host.name_regex,
            'filter[Hosts.keywords][]': keyWordsForRequest,
            'filter[Hosts.not_keywords][]': notKeyWordsForRequest,
            'filter[Hoststatus.output]': this.config.Hoststatus.output,
            'filter[Hoststatus.current_state][]': currentState,
            'filter[Hoststatus.problem_has_been_acknowledged]': hasBeenAcknowledged,
            'filter[Hoststatus.scheduled_downtime_depth]': inDowntime,
            'filter[Hoststatus.last_state_change][]': lastStateChange
        };

        this.subscriptions.add(this.HostsStatusListWidgetService.loadHosts(params).subscribe(hosts => {
            this.hosts = hosts;
            this.cdr.markForCheck();
        }));
    }

    public onPaginatorChange(page: number): void {
        this.currentPage = page;
        this.loadHosts();
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

        this.loadHosts();
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

    public toggleHostBrowserModal(hostId: number | undefined) {
        if (hostId) {
            this.HostsBrowserModalService.openHostBrowserModal(hostId);
        }
    }

    protected readonly String = String;
}
