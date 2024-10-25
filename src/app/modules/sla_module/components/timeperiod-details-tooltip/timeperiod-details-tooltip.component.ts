import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TimeperiodDetailsTooltipService } from './timeperiod-details-tooltip.service';
import { ActivatedRoute } from '@angular/router';
import { Timeperiod, TimeperiodRoot, WeekDays } from './timeperiod-details-tooltip.interface';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BadgeComponent, PopoverDirective, TableDirective } from '@coreui/angular';
import { KeyValuePipe, NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
    selector: 'oitc-timeperiod-details-tooltip',
    standalone: true,
    imports: [
        FaIconComponent,
        TranslocoDirective,
        PopoverDirective,
        TableDirective,
        BadgeComponent,
        NgIf,
        NgForOf,
        KeyValuePipe,
        NgClass
    ],
    templateUrl: './timeperiod-details-tooltip.component.html',
    styleUrl: './timeperiod-details-tooltip.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeperiodDetailsTooltipComponent implements OnInit, OnDestroy, OnChanges {

    @Input() timeperiodId: number = 0;

    private subscriptions: Subscription = new Subscription();
    public readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly TimeperiodDetailsTooltipService = inject(TimeperiodDetailsTooltipService);
    public isLoading: boolean = true;
    public timeperiod: Timeperiod = {} as Timeperiod;
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


    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            this.loadTimeperiodDetails();
        }));
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

                }));
        }
        this.cdr.markForCheck();
    }
}
