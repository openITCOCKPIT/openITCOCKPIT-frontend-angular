import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  DOCUMENT
} from '@angular/core';
import { HostsService } from '../../../pages/hosts/hosts.service';
import { ServicesService } from '../../../pages/services/services.service';
import { Observable, Subscription } from 'rxjs';
import { BrowserTimelineApiResult, VisTimelineRangechangedProperties } from './browser-timeline.interface';
import { DataSet } from "vis-data/peer";
import { DataItem, Timeline, TimelineGroup, TimelineItem, TimelineOptions } from "vis-timeline/peer";



import "vis-timeline/styles/vis-timeline-graph2d.css";
import { TranslocoDirective } from '@jsverse/transloco';
import { SkeletonModule } from 'primeng/skeleton';
import { GenericUnixtimerange } from '../../../generic.interfaces';

@Component({
    selector: 'oitc-browser-timeline',
    imports: [
    TranslocoDirective,
    SkeletonModule
],
    templateUrl: './browser-timeline.component.html',
    styleUrl: './browser-timeline.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrowserTimelineComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() type: 'Host' | 'Service' = 'Host';
    @Input() objectId: number = 0;
    @Input() public timerange$?: Observable<GenericUnixtimerange>;
    @Output() onTimerangeChange: EventEmitter<GenericUnixtimerange> = new EventEmitter<GenericUnixtimerange>();

    // Start and end timestamps of all available data
    // If you zoom in, this timestamp will not change - only if you load data for a new timerange
    private visTimelineStart: number = -1;
    private visTimelineEnd: number = -1;

    // The timerange of the currently visible data
    private timerange: GenericUnixtimerange = {start: -1, end: -1};

    public data?: BrowserTimelineApiResult;

    public failureDurationInPercent: string = "";

    protected isLoading: boolean = true;
    private subscriptions: Subscription = new Subscription();
    private readonly HostsService = inject(HostsService);
    private readonly ServicesService = inject(ServicesService);
    private readonly document = inject(DOCUMENT);

    private timeline?: Timeline; // vis-timeline instance
    private visTimelineInit: boolean = true; // true = timeline is initializing, false = timeline is ready
    private timeout: any = null; // for debouncing
    private changeTimeout: any = null; // for debouncing
    private cdr = inject(ChangeDetectorRef);


    public ngOnInit() {
        if (this.timerange$) {
            // We have an observable for the timerange.
            // We subscribe to it and update the timeline when the chart changes
            this.subscriptions.add(this.timerange$.subscribe((timerange) => {
                if (timerange.start > 0 && timerange.end > 0) {
                    if (timerange.start !== this.timerange.start || timerange.end !== this.timerange.end) {
                        //console.log("External timerange change detected", timerange);
                        this.syncTimelineWithChart(timerange);
                    }
                }
            }));
        }
    }

    public ngAfterViewInit() {
        this.loadData(-1, -1);
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadData(startTimestamp: number, endTimestamp: number): void {
        if (this.type === 'Host') {
            this.loadHostData(startTimestamp, endTimestamp);
        } else {
            this.loadServiceData(startTimestamp, endTimestamp);
        }
    }

    private loadHostData(startTimestamp: number, endTimestamp: number): void {
        if (startTimestamp !== -1 || endTimestamp !== -1) {
            if (startTimestamp > this.visTimelineStart && endTimestamp < this.visTimelineEnd) {
                // Zoom in data we already have
                // No loading needed as we already have the data

                // Save the timerange of the currently visible data
                this.timerange = {start: Math.floor(startTimestamp), end: Math.floor(endTimestamp)};
                // Emit event that we change our range
                this.onTimerangeChange.emit(this.timerange);

                this.cdr.markForCheck();
                return;
            }
        }

        this.isLoading = true;

        this.subscriptions.add(this.HostsService.loadTimeline(this.objectId, startTimestamp, endTimestamp)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.isLoading = false;
                this.data = result;

                let items = new DataSet<DataItem>(result.statehistory);
                items.add(result.downtimes);
                items.add(result.notifications);
                items.add(result.acknowledgements);
                items.add(result.timeranges);

                let groups = new DataSet<TimelineGroup>(result.groups);

                // Save the timerange of the total available data in the timeline
                this.visTimelineStart = result.start;
                this.visTimelineEnd = result.end;

                // Save the timerange of the currently visible data
                this.timerange = {start: Math.floor(result.start), end: Math.floor(result.end)};
                // Emit event that we change our range
                this.onTimerangeChange.emit(this.timerange);

                let timelineOptions: TimelineOptions = {
                    orientation: "both",
                    xss: {
                        disabled: false,
                        filterOptions: {
                            whiteList: {
                                i: ['class', 'not-xss-filtered-html'],
                                b: ['class', 'not-xss-filtered-html']
                            },
                        },
                    },
                    start: new Date(result.start * 1000),
                    end: new Date(result.end * 1000),
                    min: new Date(new Date(result.start * 1000).setFullYear(new Date(result.start * 1000).getFullYear() - 1)),
                    max: new Date(result.end * 1000),
                    zoomMin: 1000 * 10 * 60 * 5,
                    format: {
                        minorLabels: {
                            millisecond: 'SSS',
                            second: 's',
                            minute: 'H:mm',
                            hour: 'H:mm',
                            weekday: 'ddd D',
                            day: 'D',
                            week: 'w',
                            month: 'MMM',
                            year: 'YYYY'
                        },
                        majorLabels: {
                            millisecond: 'H:mm:ss',
                            second: 'D MMMM H:mm',
                            minute: 'DD.MM.YYYY',
                            hour: 'DD.MM.YYYY',
                            weekday: 'MMMM YYYY',
                            day: 'MMMM YYYY',
                            week: 'MMMM YYYY',
                            month: 'YYYY',
                            year: ''
                        }
                    }
                };

                this.renderTimeline(items, groups, timelineOptions);
            }));
    }

    private loadServiceData(startTimestamp: number, endTimestamp: number): void {
        if (startTimestamp !== -1 || endTimestamp !== -1) {
            if (startTimestamp > this.visTimelineStart && endTimestamp < this.visTimelineEnd) {
                // Zoom in data we already have
                // No loading needed as we already have the data

                // Save the timerange of the currently visible data
                this.timerange = {start: Math.floor(startTimestamp), end: Math.floor(endTimestamp)};
                // Emit event that we change our range
                this.onTimerangeChange.emit(this.timerange);

                this.cdr.markForCheck();
                return;
            }
        }

        this.isLoading = true;

        this.subscriptions.add(this.ServicesService.loadTimeline(this.objectId, startTimestamp, endTimestamp)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.isLoading = false;
                this.data = result;

                if (!result.servicestatehistory) {
                    console.log('Error: No servicestatehistory records');
                    return;
                }


                let items = new DataSet<DataItem>(result.servicestatehistory);
                items.add(result.statehistory);
                items.add(result.downtimes);
                items.add(result.notifications);
                items.add(result.acknowledgements);
                items.add(result.timeranges);

                let groups = new DataSet<TimelineGroup>(result.groups);

                this.visTimelineStart = result.start;
                this.visTimelineEnd = result.end;

                // Save the timerange of the total available data in the timeline
                this.visTimelineStart = result.start;
                this.visTimelineEnd = result.end;

                // Save the timerange of the currently visible data
                this.timerange = {start: Math.floor(result.start), end: Math.floor(result.end)};
                // Emit event that we change our range
                this.onTimerangeChange.emit(this.timerange);

                let timelineOptions: TimelineOptions = {
                    orientation: "both",
                    xss: {
                        disabled: false,
                        filterOptions: {
                            whiteList: {
                                i: ['class', 'not-xss-filtered-html'],
                                b: ['class', 'not-xss-filtered-html']
                            },
                        },
                    },
                    start: new Date(result.start * 1000),
                    end: new Date(result.end * 1000),
                    min: new Date(new Date(result.start * 1000).setFullYear(new Date(result.start * 1000).getFullYear() - 1)),
                    max: new Date(result.end * 1000),
                    zoomMin: 1000 * 10 * 60 * 5,
                    format: {
                        minorLabels: {
                            millisecond: 'SSS',
                            second: 's',
                            minute: 'H:mm',
                            hour: 'H:mm',
                            weekday: 'ddd D',
                            day: 'D',
                            week: 'w',
                            month: 'MMM',
                            year: 'YYYY'
                        },
                        majorLabels: {
                            millisecond: 'H:mm:ss',
                            second: 'D MMMM H:mm',
                            minute: 'DD.MM.YYYY',
                            hour: 'DD.MM.YYYY',
                            weekday: 'MMMM YYYY',
                            day: 'MMMM YYYY',
                            week: 'MMMM YYYY',
                            month: 'YYYY',
                            year: ''
                        }
                    }
                };

                this.renderTimeline(items, groups, timelineOptions);
            }));
    }

    private syncTimelineWithChart(timerange: GenericUnixtimerange): void {
        if (!this.timeline) {
            return;
        }

        let start = new Date(timerange.start * 1000);
        let end = new Date(timerange.end * 1000);

        this.cdr.markForCheck();

        if (timerange.start >= this.visTimelineStart && timerange.end <= this.visTimelineEnd) {
            // Timerange is already loaded
            // Just zoom in
            this.timerange = {
                start: timerange.start,
                end: timerange.end
            };
            this.timeline.setWindow(start, end);
        } else {
            // Timerange is not loaded
            // Load the data and set start and end position in timeline
            this.loadData(timerange.start, timerange.end);
            this.timeline.setWindow(start, end);
        }
    }

    private renderTimeline(items: DataSet<DataItem>, groups: DataSet<TimelineGroup>, timelineOptions: TimelineOptions) {
        const container = this.document.getElementById('visualization');
        if (container) {
            if (!this.timeline) {
                // No timeline rendered yet - render it
                this.timeline = new Timeline(container, items.get(), groups.get(), timelineOptions);

                this.timeline.on('rangechanged', (properties: VisTimelineRangechangedProperties) => {
                    if (this.visTimelineInit) {
                        this.visTimelineInit = false;
                        return;
                    }

                    if (this.isLoading) {
                        console.warn('Timeline already loading date. Waiting for server result before sending next request.');
                        return;
                    }

                    // Remove old timeout - if any
                    if (this.timeout) {
                        clearTimeout(this.timeout);
                        this.timeout = null;
                    }

                    // create new timeout for zoom debouncing
                    this.timeout = setTimeout(() => {
                        this.timeout = null;

                        const start = properties.start.getTime() / 1000;
                        const end = properties.end.getTime() / 1000;

                        this.loadData(start, end);
                    }, 500);
                });

                this.timeline.on('changed', () => {
                    if (this.visTimelineInit) {
                        return;
                    }

                    if (this.changeTimeout) {
                        clearTimeout(this.changeTimeout);
                        this.changeTimeout = null;
                    }

                    this.cdr.markForCheck();

                    this.changeTimeout = setTimeout(() => {
                        this.changeTimeout = null;
                        if (!this.timeline) {
                            return;
                        }

                        const HOSTSTATEHISTORY = 5;
                        const SERVICESTATEHISTORY = 4;

                        let timeRange = this.timeline.getWindow();
                        let visTimelineStartAsTimestamp = new Date(timeRange.start).getTime();
                        let visTimelineEndAsTimestamp = new Date(timeRange.end).getTime();

                        // Emit event that we change our range
                        //this.onTimerangeChange.emit({
                        //    start: visTimelineStartAsTimestamp,
                        //    end: visTimelineEndAsTimestamp
                        //});

                        let criticalItems: any = [];
                        if (this.type === 'Host') {
                            //@ts-ignore for itemsData
                            criticalItems = this.timeline.itemsData.get({
                                fields: ['start', 'end', 'className', 'group'],    // output the specified fields only
                                type: {
                                    start: 'Date',
                                    end: 'Date'
                                },
                                filter: (item: TimelineItem) => {
                                    return (item.group == HOSTSTATEHISTORY &&
                                        (item.className === 'bg-down' || item.className === 'bg-down-soft') &&
                                        this.CheckIfItemInRange(
                                            visTimelineStartAsTimestamp,
                                            visTimelineEndAsTimestamp,
                                            item
                                        )
                                    );

                                }
                            });
                        } else {
                            //@ts-ignore for itemsData
                            criticalItems = this.timeline.itemsData.get({
                                fields: ['start', 'end', 'className', 'group'],    // output the specified fields only
                                type: {
                                    start: 'Date',
                                    end: 'Date'
                                },
                                filter: (item: TimelineItem) => {
                                    return (item.group == SERVICESTATEHISTORY &&
                                        (item.className === 'bg-critical' || item.className === 'bg-critical-soft') &&
                                        this.CheckIfItemInRange(
                                            visTimelineStartAsTimestamp,
                                            visTimelineEndAsTimestamp,
                                            item
                                        )
                                    );

                                }
                            });
                        }


                        this.failureDurationInPercent = this.calculateFailures(
                            (visTimelineEndAsTimestamp - visTimelineStartAsTimestamp), //visible time range
                            criticalItems,
                            visTimelineStartAsTimestamp,
                            visTimelineEndAsTimestamp
                        );
                        this.cdr.markForCheck();
                    }, 500);

                });

            } else {
                // Timeline already rendered - update it
                this.timeline.setItems(items);
                //this.timeline.setGroups(groups);
                //this.timeline.setOptions(timelineOptions);
            }
        }
    }

    private CheckIfItemInRange(start: any, end: any, item: TimelineItem): boolean {
        if (item.start instanceof Date && item.end instanceof Date) {
            let itemStart = item.start.getTime();
            let itemEnd = item.end.getTime();

            if (itemEnd < start) {
                return false;
            } else if (itemStart > end) {
                return false;
            } else if (itemStart >= start && itemEnd <= end) {
                return true;
            } else if (itemStart >= start && itemEnd > end) { //item started behind the start and ended behind the end
                return true;
            } else if (itemStart < start && itemEnd > start && itemEnd < end) { //item started before the start and ended behind the end
                return true;
            } else if (itemStart < start && itemEnd >= end) { // item startet before the start and enden before the end
                return true;
            }
        }
        return false;
    }

    public calculateFailures(totalTime: number, criticalItems: any, start: number, end: number): string {
        let failuresDuration = 0;

        criticalItems.forEach((criticalItem: TimelineItem) => {
            if (criticalItem.start instanceof Date && criticalItem.end instanceof Date) {
                var itemStart = criticalItem.start.getTime();
                var itemEnd = criticalItem.end.getTime();
                failuresDuration += ((itemEnd > end) ? end : itemEnd) - ((itemStart < start) ? start : itemStart);
            }
        });
        return (failuresDuration / totalTime * 100).toFixed(3);
    };
}
