import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
    signal
} from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import {
    AlertComponent,
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent,
    PopoverDirective
} from '@coreui/angular';
import { NgClass } from '@angular/common';
import { DowntimereportsEnum } from '../downtimereports.enum';
import {
    DowntimeReportsRequest,
    DowntimeReportsResponse,
    getDefaultDowntimeReportsRequest
} from '../downtimereports.interface';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { TimeperiodsService } from '../../timeperiods/timeperiods.service';
import { TimeperiodIndex, TimeperiodsIndexParams } from '../../timeperiods/timeperiods.interface';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DowntimereportsService } from '../downtimereports.service';
import { CalendarEvent } from '../../calendars/calendars.interface';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {
    HostAvailabilityOverviewComponent
} from '../components/host-availability-overview/host-availability-overview.component';
import { HostsBarChartComponent } from '../../../components/charts/hosts-bar-chart/hosts-bar-chart.component';
import { AvailabilityColorCalculationService } from '../AvailabilityColorCalculationService';
import { NotyService } from '../../../layouts/coreui/noty.service';

@Component({
    selector: 'oitc-downtimereports-index',
    imports: [
    TranslocoDirective,
    FaIconComponent,
    PermissionDirective,
    RouterLink,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CardFooterComponent,
    CardTitleDirective,
    NavComponent,
    NavItemComponent,
    NgClass,
    FormFeedbackComponent,
    FormsModule,
    FormErrorDirective,
    FormControlDirective,
    RequiredIconComponent,
    FormLabelDirective,
    SelectComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    XsButtonDirective,
    BadgeComponent,
    TranslocoPipe,
    FullCalendarModule,
    HostAvailabilityOverviewComponent,
    PopoverDirective,
    HostsBarChartComponent,
    AlertComponent,
    FaStackComponent,
    FaStackItemSizeDirective
],
    templateUrl: './downtimereports-index.component.html',
    styleUrl: './downtimereports-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DowntimereportsIndexComponent implements OnInit, OnDestroy {
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly DowntimereportsService: DowntimereportsService = inject(DowntimereportsService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly TimeperiodsService: TimeperiodsService = inject(TimeperiodsService);
    private readonly NotyService: NotyService = inject(NotyService);
    private readonly AvailabilityColorCalculationService: AvailabilityColorCalculationService = inject(AvailabilityColorCalculationService);

    protected readonly DowntimereportsEnum = DowntimereportsEnum;
    protected readonly reportFormats: SelectKeyValue[] = [
        {value: 'PDF', key: 1},
        {value: 'HTML', key: 2}
    ];
    protected readonly reflectionStates: SelectKeyValue[] = [
        {value: this.TranslocoService.translate('soft and hard state'), key: 1},
        {value: this.TranslocoService.translate('only hard state'), key: 2}
    ];

    protected selectedTab: DowntimereportsEnum = DowntimereportsEnum.Edit;
    protected timeperiods: SelectKeyValue[] = [];
    protected post: DowntimeReportsRequest = getDefaultDowntimeReportsRequest();
    protected errors: GenericValidationError = {} as GenericValidationError;
    protected dynamicColour: boolean = false;
    protected report: DowntimeReportsResponse = {} as DowntimeReportsResponse;
    protected events: CalendarEvent[] = [];

    public ngOnInit() {
        this.loadTimeperiods();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    calendarOptions = signal<CalendarOptions>({
        plugins: [
            interactionPlugin,
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
        ],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        initialView: 'dayGridMonth',
        events: this.events,
        dayMaxEvents: 10,
        dayMaxEventRows: 10,
        weekends: true,
        editable: false,
        selectable: true,
        selectMirror: true,
        businessHours: true,
        weekNumbers: true,
        weekNumberCalculation: 'ISO',
        eventOverlap: false,
        eventDurationEditable: false,
        datesSet: this.handleDatesSet.bind(this),
        droppable: false,
        dragScroll: false
    });

    public handleDatesSet(dateInfo: { startStr: string, endStr: string, start: Date, end: Date, view: any }) {
        this.calendarOptions.update(options => ({...options, events: this.events}));
    }

    private applyColour(): void {
        this.report.downtimeReport.hostsWithOutages.forEach((outageHostElement, outageHostIndex) => {
            outageHostElement.hosts.forEach((hostElement, hostIndex) => {
                // Put colour for all services.
                Object.keys(hostElement.Services ?? {}).forEach((serviceKey) => {
                    if (hostElement.Services) {
                        const service = hostElement.Services[serviceKey];
                        if (service && service.pieChartData && service.pieChartData.availability) {
                            service.pieChartData.background = this.AvailabilityColorCalculationService.getBackgroundColor(service.pieChartData.availability);
                        }
                    }
                });

                // Put colour for the host.
                hostElement.pieChartData.background = this.AvailabilityColorCalculationService.getBackgroundColor(hostElement.pieChartData.availability);
            });

        });
    }

    private downloadReport(): void {
        this.subscriptions.add(this.DowntimereportsService.generateReport(this.post)
            .subscribe((result: any) => {
            })
        );
    }

    private fetchReport(): void {

        this.report = {} as DowntimeReportsResponse;
        this.events = [];

        this.subscriptions.add(this.DowntimereportsService.getIndex(this.post)
            .subscribe((result) => {
                if (!result.success) {
                    if (result.data) {
                        this.NotyService.genericError();
                        this.errors = result.data;
                    }
                    this.cdr.markForCheck();
                    return;
                }

                // If only Download, then only download. Duh.
                if (this.post.report_format === 1) {
                    this.downloadReport();
                    return;
                }
                this.report = result.data;

                this.applyColour();

                this.report.downtimeReport?.downtimes.Hosts.forEach((element, index) => {

                    this.events.push({
                        default_holiday: false,
                        className: 'downtime-report-host-event',
                        title: element.Hosts.name,
                        start: element.scheduled_start_time,
                        end: element.scheduled_end_time,
                        extendedProps: {
                            type: 'host',
                            author: element.author_name,
                            comment: element.comment_data
                        }
                    });
                });
                this.report.downtimeReport?.downtimes.Services?.forEach((element) => {
                    this.events.push({
                        default_holiday: false,
                        className: 'downtime-report-service-event',
                        title: element.Hosts.name + ' | ' + element.Servicetemplates.name,
                        start: element.scheduled_start_time,
                        end: element.scheduled_end_time,
                        extendedProps: {
                            type: 'service',
                            author: element.author_name,
                            comment: element.comment_data
                        }
                    });
                });

                this.changeTab(DowntimereportsEnum.Calendar);
                this.cdr.markForCheck();
            })
        );
    }

    public formatDate(timestamp: number): string {
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleDateString('de-DE');
        const formattedTime = date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
        return `${formattedDate} - ${formattedTime}`;
    }

    public formatTime(timestamp: number): string {
        return new Date(timestamp).getHours() + ":" + new Date(timestamp).getMinutes();
    }

    protected submit(): void {
        this.errors = {} as GenericValidationError;
        this.fetchReport();
    }

    private loadTimeperiods(): void {
        this.subscriptions.add(this.TimeperiodsService.getIndex({} as TimeperiodsIndexParams).subscribe(data => {
            this.timeperiods = [];
            data.all_timeperiods.forEach((element: TimeperiodIndex) => {
                this.timeperiods.push({
                    value: element.Timeperiod.name,
                    key: element.Timeperiod.id
                } as SelectKeyValue);
            });

            this.cdr.markForCheck();
        }));
    }

    protected changeTab(newTab: DowntimereportsEnum): void {
        this.selectedTab = newTab;
    }

}
