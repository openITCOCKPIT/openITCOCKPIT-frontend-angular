import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TimeperiodDetailsTooltipService } from './timeperiod-details-tooltip.service';
import { ActivatedRoute } from '@angular/router';
import { Timeperiod, TimeperiodRoot, WeekDays } from './timeperiod-details-tooltip.interface';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BadgeComponent, PopoverDirective, TableDirective } from '@coreui/angular';
import { KeyValuePipe } from '@angular/common';
import _ from 'lodash';

@Component({
    selector: 'oitc-timeperiod-details-tooltip',
    imports: [
        FaIconComponent,
        TranslocoDirective,
        PopoverDirective,
        TableDirective,
        BadgeComponent,
        KeyValuePipe
    ],
    templateUrl: './timeperiod-details-tooltip.component.html',
    styleUrl: './timeperiod-details-tooltip.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeperiodDetailsTooltipComponent implements OnDestroy, OnChanges {

    @Input() timeperiodId: number = 0;

    private subscriptions: Subscription = new Subscription();
    public readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly TimeperiodDetailsTooltipService = inject(TimeperiodDetailsTooltipService);
    public isLoading: boolean = true;
    public timeperiod?: Timeperiod;
    public weekDays: WeekDays = {} as WeekDays;
    public label = {
        messageExists: this.TranslocoService.translate('Yes'),
        messageNotExists: this.TranslocoService.translate('No')
    };
    private cdr = inject(ChangeDetectorRef);

    ngOnChanges(changes: SimpleChanges): void {
        //this is necessary to update the component if the timeperiodId was changed
        this.loadTimeperiodDetails();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadTimeperiodDetails() {
        this.isLoading = true;
        if (this.timeperiodId > 0) {
            this.subscriptions.add(this.TimeperiodDetailsTooltipService.loadTimeperiodDetails(this.timeperiodId)
                .subscribe((result: TimeperiodRoot) => {
                    this.cdr.markForCheck();
                    this.isLoading = false;

                    this.timeperiod = result.timeperiod;
                    this.weekDays = [];
                    for (let i = 0; i <= 6; i++) {
                        // Array required to keep order
                        this.weekDays[i] = [];
                    }


                    for (let key in this.timeperiod.timeperiod_timeranges) {
                        let timerange = this.timeperiod.timeperiod_timeranges[key];
                        // Server day 1 - 7
                        // JavaScript days 0 - 6 to get an array (array has to start with 0!) :(
                        let day = timerange.day - 1;
                        this.weekDays[day].push({
                            start: timerange.start,
                            end: timerange.end
                        });
                    }

                    for (let day in this.weekDays) {
                        this.weekDays[day] = _.sortBy(this.weekDays[day], [function (o) {
                            return o.start;
                        }]);
                    }
                }));
        }
        this.cdr.markForCheck();
    }
}
