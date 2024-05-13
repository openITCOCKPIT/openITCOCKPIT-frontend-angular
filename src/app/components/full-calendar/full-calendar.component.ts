import { Component, Input } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import { Countries } from '../../pages/calendars/calendars.interface';

@Component({
    selector: 'oitc-full-calendar',
    standalone: true,
    imports: [
        FullCalendarModule
    ],
    templateUrl: './full-calendar.component.html',
    styleUrl: './full-calendar.component.css'
})
export class FullCalendarComponent {
    @Input() calendarOptions!: CalendarOptions;
}
