import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    Output,
    signal,
    ViewChild
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import {
    CalendarOptions,
    DateSelectArg,
    DayCellContentArg,
    EventApi,
    EventChangeArg,
    EventClickArg
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { AddNewEvent, CalendarEvent } from '../../../../pages/calendars/calendars.interface';
import { DateTime } from 'luxon';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ModalService } from '@coreui/angular';

@Component({
    selector: 'oitc-changecalendars-calendar',
    imports: [
        TranslocoDirective,
        FullCalendarModule,
        FaIconComponent,
        XsButtonDirective
    ],
    templateUrl: './changecalendars-calendar.component.html',
    styleUrl: './changecalendars-calendar.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangecalendarsCalendarComponent {
    private readonly cdr = inject(ChangeDetectorRef);

    @ViewChild('fullCalendar') fullCalendar!: FullCalendarComponent;

    private _events: CalendarEvent[] = [];


    @Input()
    public set events(externalEvents: CalendarEvent[]) {
        this._events = externalEvents;
        this.calendarOptions.update(options => ({...options, events: this.events}));
    }


    public get events(): CalendarEvent[] {
        return this._events;
    }

    @Output() eventsChange = new EventEmitter<CalendarEvent[]>();
    @Output() eventClick = new EventEmitter<EventClickArg>();
    @Output() onCreateClick = new EventEmitter<any>();

    // Gets used by the add and edit holiday modal
    public addNewEvent: AddNewEvent = {
        title: '',
        start: ''
    };

    private readonly modalService = inject(ModalService);


    calendarVisible = signal(true);

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
        eventClick: this.handleEventClick.bind(this),
        eventsSet: this.handleEvents.bind(this),
        eventChange: this.handleEventChange.bind(this),


        /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
    });
    currentEvents = signal<EventApi[]>([]);

    constructor() {
    }


    public handleDateSelect(selectInfo: DateSelectArg) {
        //console.log("Implement handleDateSelect");
    }

    // Handle event drag and drop
    public handleEventChange(changeInfo: EventChangeArg) {
        // Event has been moved in the calendar - update the original event in this.events

        // Remove old event
        this.deleteEvent(changeInfo.oldEvent.startStr, false);

        // Add new event
        this.events = this.events.concat({
            title: changeInfo.event.title,
            start: changeInfo.event.startStr,
            default_holiday: false,
            className: 'bg-color-magenta'
        })

        this.calendarOptions.update(options => ({...options, events: this.events}));
        this.eventsChange.emit(this.events); // Emit the changes
        this.cdr.markForCheck();
    }

    // Handle event edit
    public handleEventClick(clickInfo: EventClickArg) {
        if (this.eventClick) {
            this.eventClick.emit(clickInfo);
            return;
        }
        this.cdr.markForCheck();
    }

    public handleEvents(events: EventApi[]) {
        this.currentEvents.set(events);
        this.cdr.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
    }


    public formatJsDateToFullcalendarString(jsDate: Date) {
        let date = DateTime.fromJSDate(jsDate);
        return date.toFormat('yyyy-MM-dd');
    }

    public handleDatesSet(dateInfo: { startStr: string, endStr: string, start: Date, end: Date, view: any }) {
        //console.log('handleDatesSet', dateInfo);
        this.calendarOptions.update(options => ({...options, events: this.events}));
        this.eventsChange.emit(this.events);
    }

    public hasEvents(date: string) {
        for (var index in this.events) {
            if (this.events[index].start === date) {
                return true;
            }
        }
        return false;
    }

    public deleteEvent(date: string, refreshCalender: boolean = false) {
        // I don't know why BUT, if we use modern TypeScript array methods like .filter .map. forEach the calendar update works as exacted.
        // If we use the old school for loop, the calendar will not update the events. Don't ask me why
        // The new fancy methods return a new array instead of modifying the original array and I guess this is the trick or so
        this.events = this.events.filter(event => event.start !== date);
        this.eventsChange.emit(this.events);
        if (refreshCalender) {
            this.calendarOptions.update(options => ({...options, events: this.events}));
        }
    };

    public deleteAllHolidays() {
        // I don't know why BUT, if we use modern TypeScript array methods like .filter .map. forEach the calendar update works as exacted.
        // If we use the old school for loop, the calendar will not update the events. Don't ask me why
        // The new fancy methods return a new array instead of modifying the original array and I guess this is the trick or so
        this.events = this.events.filter(event => !event.default_holiday);
        this.calendarOptions.update(options => ({...options, events: this.events}));
        this.eventsChange.emit(this.events);
    }

    public deleteAllEvents() {
        this.events = [];
        this.calendarOptions.update(options => ({...options, events: this.events}));
        this.eventsChange.emit(this.events);
        //this.fullCalendar.getApi().destroy();
        //this.fullCalendar.getApi().render();
    }

    public deleteAllMonthEvents() {
        let CalendarApi = this.fullCalendar.getApi();


        // I don't know why BUT, if we use modern TypeScript array methods like .filter .map. forEach the calendar update works as exacted.
        // If we use the old school for loop, the calendar will not update the events. Don't ask me why
        // The new fancy methods return a new array instead of modifying the original array and I guess this is the trick or so
        this.events = this.events.filter(event => {
            let start = new Date(event.start);
            if (start >= CalendarApi.view.currentStart && start <= CalendarApi.view.currentEnd) {
                // Remove event of current month
                return false;
            }
            // Keep event
            return true;
        });

        this.calendarOptions.update(options => ({...options, events: this.events}));
        this.eventsChange.emit(this.events);
    }


    public triggerAddEventModal(arg: DayCellContentArg) {
        if (this.onCreateClick) {
            this.onCreateClick.emit(arg);
            return;
        }
        this.addNewEvent = {
            title: '',
            start: this.formatJsDateToFullcalendarString(arg.date),
            CalendarApi: arg.view.calendar
        };

        this.modalService.toggle({
            show: true,
            id: 'addNewHolidayModal',
        });
        this.cdr.markForCheck();
    }

    public addNewHoliday() {
        if (this.addNewEvent.title == '') {
            // No title given
            return;
        }

        if (!this.addNewEvent.CalendarApi) {
            // No calendar api given
            return;
        }

        //Add new event
        this.events = this.events.concat({
            title: this.addNewEvent.title,
            start: this.addNewEvent.start,
            default_holiday: false,
            className: 'bg-color-magenta'
        });
        this.calendarOptions.update(options => ({...options, events: this.events}));
        this.eventsChange.emit(this.events);

        this.modalService.toggle({
            show: false,
            id: 'addNewHolidayModal',
        });
        this.cdr.markForCheck();
    }

    public updateHoliday() {
        if (this.addNewEvent.title == '') {
            // No title given
            return;
        }

        if (!this.addNewEvent.CalendarApi) {
            // No calendar api given
            return;
        }

        // Find the event to update
        let event = this.events.find(event => event.start === this.addNewEvent.start);
        if (!event) {
            return;
        }

        // Remove original event
        this.deleteEvent(this.addNewEvent.start, false);

        event.title = this.addNewEvent.title;
        event.default_holiday = false;
        event.className = 'bg-color-magenta';

        this.events = this.events.concat(event);

        this.calendarOptions.update(options => ({...options, events: this.events}));
        this.eventsChange.emit(this.events);

        this.modalService.toggle({
            show: false,
            id: 'editHolidayModal',
        });
        this.cdr.markForCheck();
    }
}
