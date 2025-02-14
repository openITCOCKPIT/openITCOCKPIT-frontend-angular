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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
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
    NavItemComponent
} from '@coreui/angular';
import { NgClass, NgForOf, NgIf } from '@angular/common';
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
import { TrueFalseDirective } from '../../../directives/true-false.directive';
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
        NgIf,
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
        TrueFalseDirective,
        BadgeComponent,
        TranslocoPipe,
        FullCalendarModule,
        HostAvailabilityOverviewComponent,
        NgForOf
    ],
    templateUrl: './downtimereports-index.component.html',
    styleUrl: './downtimereports-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DowntimereportsIndexComponent implements OnInit, OnDestroy {
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly DowntimereportsService: DowntimereportsService = inject(DowntimereportsService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly TimeperiodsService: TimeperiodsService = inject(TimeperiodsService);

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
        //initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
        events: this.events,
        weekends: true,
        editable: true,
        selectable: true,
        selectMirror: true,
        businessHours: true,
        weekNumbers: true,
        weekNumberCalculation: 'ISO',
        eventOverlap: false,
        eventDurationEditable: false,
        datesSet: this.handleDatesSet.bind(this),
        droppable: false,
        dragScroll: false,
        eventDragMinDistance: 999999999,
    });

    public handleDatesSet(dateInfo: { startStr: string, endStr: string, start: Date, end: Date, view: any }) {
        //console.log('handleDatesSet', dateInfo);
        this.calendarOptions.update(options => ({...options, events: this.events}));
    }

    protected submit(): void {
        console.log(this.post);
        this.report = {} as DowntimeReportsResponse;


        this.subscriptions.add(this.DowntimereportsService.getIndex(this.post)
            .subscribe((result: DowntimeReportsResponse) => {
                this.report = result;

                this.report.downtimeReport?.downtimes.Hosts.forEach((element) => {
                    this.events.push({
                        default_holiday: false,
                        className: '',
                        title: element.Hosts.name,
                        start: element.scheduled_start_time,
                        end: element.scheduled_end_time
                    });
                });

                console.warn(this.report);
                console.warn(this.events);

                this.changeTab(DowntimereportsEnum.Calendar);

                this.cdr.markForCheck();
            })
        );
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
