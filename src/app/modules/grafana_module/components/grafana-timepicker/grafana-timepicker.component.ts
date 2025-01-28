import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    ElementRef,
    EventEmitter,
    inject,
    input,
    OnDestroy,
    Output
} from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    ColComponent,
    DropdownComponent,
    DropdownMenuDirective,
    DropdownToggleDirective,
    RowComponent
} from '@coreui/angular';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { GrafanaTimepickerChange } from './grafana-timepicker.interface';
import { Subscription } from 'rxjs';

@Component({
    selector: 'oitc-grafana-timepicker',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        DropdownComponent,
        XsButtonDirective,
        DropdownToggleDirective,
        DropdownMenuDirective,
        RowComponent,
        ColComponent,
        NgForOf,
        NgClass,
        NgIf
    ],
    templateUrl: './grafana-timepicker.component.html',
    styleUrl: './grafana-timepicker.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrafanaTimepickerComponent implements OnDestroy {

    private selectedTimerange = 'now-3h';
    private selectedAutoRefresh = '1m';

    selectedTimerangeInput = input<string>('now-3h');
    selectedAutoRefreshInput = input<string>('1m');


    @Output() change = new EventEmitter<GrafanaTimepickerChange>();

    public humanTimerange: string = '';
    public humanAutoRefresh: string = '';

    private readonly TranslocoService = inject(TranslocoService);
    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    public timeranges = {
        quick: [
            {key: "now-2d", name: this.TranslocoService.translate('Last 2 days')},
            {key: "now-7d", name: this.TranslocoService.translate('Last 7 days')},
            {key: "now-30d", name: this.TranslocoService.translate('Last 30 days')},
            {key: "now-90d", name: this.TranslocoService.translate('Last 90 days')},
            {key: "now-6M", name: this.TranslocoService.translate('Last 6 months')},
            {key: "now-1y", name: this.TranslocoService.translate('Last year')}
        ],
        today: [
            {key: "now%2Fd", name: this.TranslocoService.translate('Today so far')},
            {key: "now%2Fw", name: this.TranslocoService.translate('This week so far')},
            {key: "now%2FM", name: this.TranslocoService.translate('This month so far')}
        ],
        last: [
            {key: "now-5m", name: this.TranslocoService.translate('Last 5 minutes')},
            {key: "now-15m", name: this.TranslocoService.translate('Last 15 minutes')},
            {key: "now-30m", name: this.TranslocoService.translate('Last 30 minutes')},
            {key: "now-1h", name: this.TranslocoService.translate('Last 1 hour')},
            {key: "now-3h", name: this.TranslocoService.translate('Last 3 hours')},
            {key: "now-6h", name: this.TranslocoService.translate('Last 6 hours')},
            {key: "now-12h", name: this.TranslocoService.translate('Last 12 hours')},
            {key: "now-24h", name: this.TranslocoService.translate('Last 24 hours')}
        ],
        update_interval: [
            {key: "5s", name: this.TranslocoService.translate('Refresh every 5s')},
            {key: "10s", name: this.TranslocoService.translate('Refresh every 10s')},
            {key: "30s", name: this.TranslocoService.translate('Refresh every 30s')},
            {key: "1m", name: this.TranslocoService.translate('Refresh every 1m')},
            {key: "5m", name: this.TranslocoService.translate('Refresh every 5m')},
            {key: "15m", name: this.TranslocoService.translate('Refresh every 15m')}
        ]
    };

    constructor(elementRef: ElementRef) {
        effect(() => {
            this.selectedTimerange = this.selectedTimerangeInput();
            this.selectedAutoRefresh = this.selectedAutoRefreshInput();
            this.setHumanNames();
            this.cdr.markForCheck();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public changeAutoRefresh(refreshValue: string, name: string) {
        this.selectedAutoRefresh = refreshValue;

        this.setHumanNames();
        this.cdr.markForCheck();

        this.change.emit({
            timerange: this.selectedTimerange,
            autorefresh: this.selectedAutoRefresh
        });
    }

    public changeTimerange(timerange: string, name: string) {
        this.selectedTimerange = timerange;

        this.setHumanNames();

        this.change.emit({
            timerange: this.selectedTimerange,
            autorefresh: this.selectedAutoRefresh
        });
    }

    private setHumanNames(): void {
        this.humanTimerange = '';
        this.humanAutoRefresh = '';

        for (const category of Object.values(this.timeranges)) {
            const item = category.find((item: any) => item.key === this.selectedTimerange);
            if (item) {
                this.humanTimerange = item.name;
            }

            const interval = category.find((interval: any) => interval.key === this.selectedAutoRefresh);
            if (interval) {
                this.humanAutoRefresh = interval.name;
            }
        }
    }
}
