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
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { ServicesIndexRoot } from '../../../services/services.interface';
import { ServicesStatusListWidgetService } from './services-status-list-widget.service';
import {
    ServicesStatusListWidgetConfig,
    ServicesStatusListWidgetParams
} from './services-status-list-widget.interface';
import { ServiceStatusNames } from '../../../services/services.enum';
import {
    AcknowledgementIconComponent
} from '../../../acknowledgements/acknowledgement-icon/acknowledgement-icon.component';
import { AsyncPipe, NgClass } from '@angular/common';
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
import {
    ServicestatusIconComponent
} from '../../../../components/services/servicestatus-icon/servicestatus-icon.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-services-status-list-widget',
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
    ServicestatusIconComponent,
    RouterLink,
    NgClass
],
    templateUrl: './services-status-list-widget.component.html',
    styleUrl: './services-status-list-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesStatusListWidgetComponent extends BaseWidgetComponent implements AfterViewInit {
    protected flipped = signal<boolean>(false);
    @ViewChild('boxContainer') boxContainer?: ElementRef;

    public services?: ServicesIndexRoot;

    private scrollIntervalId: any = null;

    // Limit of records to show - will be calculated depending on the height of the widget
    public limit: number = 1;
    public currentPage: number = 1;
    public widgetHeight: number = 0;


    // widget config will be loaded from the server
    public config?: ServicesStatusListWidgetConfig;
    public configHostKeyWords: string[] = [];
    public configHostNotKeyWords: string[] = [];
    public configServiceKeyWords: string[] = [];
    public configServiceNotKeyWords: string[] = [];


    private readonly ServicesStatusListWidgetService = inject(ServicesStatusListWidgetService);

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
        this.loadServices();
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
            if (this.services && this.services.scroll && this.services.scroll.hasNextPage) {
                this.currentPage++;
                this.loadServices();
            } else {
                this.currentPage = 1;
                this.loadServices();
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

        this.configHostKeyWords = [];
        this.configHostNotKeyWords = [];
        this.configServiceKeyWords = [];
        this.configServiceNotKeyWords = [];

        this.subscriptions.add(this.ServicesStatusListWidgetService.loadWidgetConfig(this.widget.id).subscribe(config => {
            // Save the widget config
            this.config = config;

            // "".split() returns [''] instead of [] like in php
            this.configHostKeyWords = (config.Host.keywords !== '') ? config.Host.keywords.split(',') : [];
            this.configHostNotKeyWords = (config.Host.not_keywords !== '') ? config.Host.not_keywords.split(',') : [];
            this.configServiceKeyWords = (config.Service.keywords !== '') ? config.Service.keywords.split(',') : [];
            this.configServiceNotKeyWords = (config.Service.not_keywords !== '') ? config.Service.not_keywords.split(',') : [];


            this.loadServices();
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

        this.config.Host.keywords = this.configHostKeyWords.join(',');
        this.config.Host.not_keywords = this.configHostNotKeyWords.join(',');
        this.config.Service.keywords = this.configServiceKeyWords.join(',');
        this.config.Service.not_keywords = this.configServiceNotKeyWords.join(',');

        this.subscriptions.add(this.ServicesStatusListWidgetService.saveWidgetConfig(this.widget.id, this.config).subscribe((response) => {
            // Close config
            this.flipped.set(false);

            // Reload the services
            this.loadServices();
        }));
    }

    public loadServices(): void {
        if (!this.config) {
            return;
        }

        let hasBeenAcknowledged: '' | boolean = '';
        if (this.config.Servicestatus.acknowledged != this.config.Servicestatus.not_acknowledged) {
            hasBeenAcknowledged = this.config.Servicestatus.acknowledged;
        }

        let inDowntime: '' | boolean = '';
        if (this.config.Servicestatus.in_downtime != this.config.Servicestatus.not_in_downtime) {
            inDowntime = this.config.Servicestatus.in_downtime;
        }

        // "".split() returns [''] instead of [] like in php
        const hostKkeyWordsForRequest = (this.config.Host.keywords !== '') ? this.config.Host.keywords.split(',') : [];
        const hostNotKeyWordsForRequest = (this.config.Host.not_keywords !== '') ? this.config.Host.not_keywords.split(',') : [];
        const serviceKeyWordsForRequest = (this.config.Service.keywords !== '') ? this.config.Service.keywords.split(',') : [];
        const serviceNotKeyWordsForRequest = (this.config.Service.not_keywords !== '') ? this.config.Service.not_keywords.split(',') : [];

        let lastStateChange: [
                number | null,
                'SECOND' | 'MINUTE' | 'HOUR' | 'DAY' | null
        ] = [null, 'MINUTE'];
        if (this.config.Servicestatus.state_older_than && this.config.Servicestatus.state_older_than_unit && this.config.Servicestatus.state_older_than > 0) {
            lastStateChange = [
                this.config.Servicestatus.state_older_than, // Important, has to be array index 0 (see Filter.php)
                this.config.Servicestatus.state_older_than_unit // Important, has to be array index 1 (see Filter.php)
            ];
        }

        // currentState is an array of ['up', 'down', 'unreachable']
        let currentState: ServiceStatusNames[] = [];
        for (let key in this.config.Servicestatus.current_state) {
            const keyName = key as keyof typeof ServiceStatusNames;
            if (this.config.Servicestatus.current_state[keyName]) {
                currentState.push(
                    ServiceStatusNames[key as keyof typeof ServiceStatusNames]
                );
            }
        }

        // Apply the config to the filter
        const params: ServicesStatusListWidgetParams = {
            angular: true,
            sort: this.config.sort,
            direction: this.config.direction,
            scroll: this.config.useScroll,
            page: this.currentPage,
            limit: this.limit,
            'filter[Hosts.name]': this.config.Host.name,
            'filter[Hosts.name_regex]': this.config.Host.name_regex,
            'filter[servicename]': this.config.Service.name,
            'filter[servicename_regex]': this.config.Service.name_regex,
            'filter[Hosts.keywords][]': hostKkeyWordsForRequest,
            'filter[Hosts.not_keywords][]': hostNotKeyWordsForRequest,
            'filter[keywords][]': serviceKeyWordsForRequest,
            'filter[not_keywords][]': serviceNotKeyWordsForRequest,
            'filter[Servicestatus.output]': this.config.Servicestatus.output,
            'filter[Servicestatus.current_state][]': currentState,
            'filter[Servicestatus.problem_has_been_acknowledged]': hasBeenAcknowledged,
            'filter[Servicestatus.scheduled_downtime_depth]': inDowntime,
            'filter[Servicestatus.last_state_change][]': lastStateChange
        };

        this.subscriptions.add(this.ServicesStatusListWidgetService.loadServices(params).subscribe(services => {
            this.services = services;
            this.cdr.markForCheck();
        }));
    }

    public onPaginatorChange(page: number): void {
        this.currentPage = page;
        this.loadServices();
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

        this.loadServices();
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

    protected readonly String = String;
}
