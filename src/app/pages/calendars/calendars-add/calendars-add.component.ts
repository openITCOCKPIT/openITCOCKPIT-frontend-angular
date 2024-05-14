import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Router, RouterLink } from '@angular/router';
import {
    ButtonCloseDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ModalToggleDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { UserMacrosModalComponent } from '../../commands/user-macros-modal/user-macros-modal.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { AddNewEvent, CalendarContainer, CalendarEvent, CalendarPost, Countries } from '../calendars.interface';
import { NgSelectModule } from '@ng-select/ng-select';
import { AsyncPipe, JsonPipe, KeyValuePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
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
import { forkJoin, Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { CalendarsService } from '../calendars.service';
import { GenericValidationError } from '../../../generic-responses';
import { DateTime } from "luxon";
import { TrueFalseDirective } from '../../../directives/true-false.directive';

@Component({
    selector: 'oitc-calendars-add',
    standalone: true,
    imports: [
        CoreuiComponent,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FormDirective,
        FormsModule,
        ReactiveFormsModule,
        BackButtonDirective,
        NavComponent,
        NavItemComponent,
        UserMacrosModalComponent,
        XsButtonDirective,
        CardBodyComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        CardFooterComponent,
        NgSelectModule,
        NgForOf,
        NgOptionHighlightModule,
        AsyncPipe,
        JsonPipe,
        NgIf,
        RowComponent,
        ColComponent,
        FullCalendarModule,
        DropdownComponent,
        DropdownToggleDirective,
        DropdownMenuDirective,
        KeyValuePipe,
        DropdownItemDirective,
        NgClass,
        ButtonCloseDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        TrueFalseDirective,
        ModalToggleDirective,
        TranslocoPipe
    ],
    templateUrl: './calendars-add.component.html',
    styleUrl: './calendars-add.component.css'
})
export class CalendarsAddComponent implements OnInit, OnDestroy {
    @ViewChild('fullCalendar') fullCalendar!: FullCalendarComponent;


    public post: CalendarPost = {
        container_id: 0,
        name: "",
        description: "",
        events: []
    }

    public addNewEvent: AddNewEvent = {
        title: '',
        start: ''
    };

    public containers: CalendarContainer[] = [];
    public countries: Countries = {};
    public errors: GenericValidationError | null = null;
    public defaultDate = new Date();
    public countryCode = 'de';

    public events: CalendarEvent[] = [];
    public eventsLoaded: boolean = false; // to not render the calendar BEFORE the events are loaded

    private CalendarsService = inject(CalendarsService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly modalService = inject(ModalService);
    private router = inject(Router);

    private subscriptions: Subscription = new Subscription();


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
        //select: this.handleDateSelect.bind(this),
        eventClick: this.handleEventClick.bind(this),
        eventsSet: this.handleEvents.bind(this),
        //dayCellDidMount: this.handleDayCellDidMount.bind(this),
        eventChange: this.handleEventChange.bind(this),


        /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
    });
    currentEvents = signal<EventApi[]>([]);

    constructor(private changeDetector: ChangeDetectorRef) {
    }


    public handleCalendarToggle() {
        this.calendarVisible.update((bool) => !bool);
    }

    public handleWeekendsToggle() {
        this.calendarOptions.update((options) => ({
            ...options,
            weekends: !options.weekends,
        }));
    }

    public handleDateSelect(selectInfo: DateSelectArg) {
        console.log("Implement handleDateSelect");
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
            className: 'bg-primary'
        })

        this.calendarOptions.update(options => ({...options, events: this.events}));
    }

    // Handle event edit
    public handleEventClick(clickInfo: EventClickArg) {
        clickInfo.event;
        let start = new Date(String(clickInfo.event.start));
        this.addNewEvent = {
            title: clickInfo.event.title,
            start: this.formatJsDateToFullcalendarString(start),
            CalendarApi: clickInfo.view.calendar
        };

        this.modalService.toggle({
            show: true,
            id: 'editHolidayModal',
        });
    }

    public handleEvents(events: EventApi[]) {
        this.currentEvents.set(events);
        this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
    }

    public ngOnInit() {
        let request = {
            containers: this.CalendarsService.getContainers(),
            countries: this.CalendarsService.getCountries()
        };

        forkJoin(request).subscribe(
            (result) => {
                this.containers = result.containers;
                this.countries = result.countries;
            });

        this.loadHolidays();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public formatJsDateToFullcalendarString(jsDate: Date) {
        let date = DateTime.fromJSDate(jsDate);
        return date.toFormat('yyyy-MM-dd');
    }

    public changeCountryCodeAndLoadHolidays(countryCode: string) {
        this.countryCode = countryCode;
        this.loadHolidays();
    }

    public loadHolidays() {
        this.subscriptions.add(this.CalendarsService.getHolidays(this.countryCode)
            .subscribe((result) => {
                // Keep custom events
                let customEvents = this.events.filter(event => !event.default_holiday);

                // Reset events to server result
                this.events = result;

                // Add custom events but check for duplicates
                customEvents.forEach(customEvent => {
                    if (this.hasEvents(customEvent.start)) {
                        // Remove the existing event, so we only have one event per day
                        this.deleteEvent(customEvent.start)
                    }
                    this.events.push(customEvent);
                });


                this.calendarOptions.update(options => ({...options, events: this.events}));
                this.eventsLoaded = true;
            })
        );
    }

    public handleDatesSet(dateInfo: { startStr: string, endStr: string, start: Date, end: Date, view: any }) {
        //console.log('handleDatesSet', dateInfo);
        this.calendarOptions.update(options => ({...options, events: this.events}));

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
    }

    public deleteAllEvents() {
        this.events = [];
        this.calendarOptions.update(options => ({...options, events: this.events}));
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
    }


    public submit() {
        console.log('Implement submit');
    }

    public triggerAddEventModal(arg: DayCellContentArg) {
        this.addNewEvent = {
            title: '',
            start: this.formatJsDateToFullcalendarString(arg.date),
            CalendarApi: arg.view.calendar
        };

        this.modalService.toggle({
            show: true,
            id: 'addNewHolidayModal',
        });
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
            className: 'bg-primary'
        });
        this.calendarOptions.update(options => ({...options, events: this.events}));

        this.modalService.toggle({
            show: false,
            id: 'addNewHolidayModal',
        });
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
        event.className = 'bg-primary';

        this.events = this.events.concat(event);

        this.calendarOptions.update(options => ({...options, events: this.events}));

        this.modalService.toggle({
            show: false,
            id: 'editHolidayModal',
        });
    }

}
