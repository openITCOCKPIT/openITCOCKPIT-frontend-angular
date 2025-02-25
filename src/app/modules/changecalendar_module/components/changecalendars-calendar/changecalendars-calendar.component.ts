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
import { CalendarOptions, EventApi, EventClickArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarEvent } from '../../../../pages/calendars/calendars.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-changecalendars-calendar',
    imports: [
        TranslocoDirective,
        FullCalendarModule,
        FaIconComponent,
        XsButtonDirective,
        NgIf
    ],
    templateUrl: './changecalendars-calendar.component.html',
    styleUrl: './changecalendars-calendar.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangecalendarsCalendarComponent {
    private readonly cdr = inject(ChangeDetectorRef);
    private _events: CalendarEvent[] = [];
    private _editable: boolean = true;
    private _initialView: string = 'dayGridMonth';

    @ViewChild('fullCalendar') fullCalendar!: FullCalendarComponent;

    @Input()
    public set events(externalEvents: CalendarEvent[]) {
        this._events = externalEvents;
        this.calendarOptions.update(options => ({...options, events: this.events}));
    }

    public get events(): CalendarEvent[] {
        return this._events;
    }

    @Input()
    public set editable(editable: boolean) {
        this._editable = editable;
    }

    public get editable(): boolean {
        return this._editable;
    }

    @Input()
    public set initialView(initialView: string) {
        console.warn("initialView", initialView);

        // Force reload of calendar here
        this.calendarOptions.update(options => ({...options, initialView: initialView}));
        this._initialView = initialView;
    }

    public get initialView(): string {
        return this._initialView;
    }

    @Output() eventsChange = new EventEmitter<CalendarEvent[]>();
    @Output() eventClick = new EventEmitter<EventClickArg>();
    @Output() onCreateClick = new EventEmitter<any>();

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
        initialView: this._initialView,
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
        droppable: false,
        dragScroll: false,
        eventDragMinDistance: 999999999,
    });
    currentEvents = signal<EventApi[]>([]);

    // Handle event edit
    public handleEventClick(clickInfo: EventClickArg) {
        console.warn(this.calendarOptions());
        if (this.eventClick) {
            this.eventClick.emit(clickInfo);
            return;
        }
        this.cdr.markForCheck();
    }

    public formatTime(timestamp: number): string {
        let date = new Date(timestamp),
            hours = date.getHours().toString().padStart(2, '0'),
            minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    public handleEvents(events: EventApi[]) {
        this.currentEvents.set(events);
        this.cdr.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
    }

    public handleDatesSet(dateInfo: { startStr: string, endStr: string, start: Date, end: Date, view: any }) {
        //console.log('handleDatesSet', dateInfo);
        this.calendarOptions.update(options => ({...options, events: this.events}));
        this.eventsChange.emit(this.events);
    }

}
