import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';

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
    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin, interactionPlugin],
        dateClick: (arg: any) => this.handleDateClick(arg),
        events: [
            {title: 'event 1', date: '2019-04-01'},
            {title: 'event 2', date: '2019-04-02'}
        ]
    };

    handleDateClick(arg: { dateStr: string; }) {
        alert('date click! ' + arg.dateStr)
    }
}
