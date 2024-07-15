import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { TimeperiodsService } from '../timeperiods.service';
import { User, UsercontainerrolesLdap, ViewDetailsTimeperiod } from '../timeperiods.interface';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ObjectUuidComponent } from '../../../layouts/coreui/object-uuid/object-uuid.component';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'oitc-timeperiods-view-details',
    standalone: true,
    imports: [
        XsButtonDirective,
        RouterLink,
        RowComponent,
        ColComponent,
        FullCalendarModule,
        ObjectUuidComponent,
        CoreuiComponent,
        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        NavComponent,
        NavItemComponent,
        BackButtonDirective,
        PermissionDirective,
        CardBodyComponent,
        CardTitleDirective,
        TranslocoDirective
    ],
    templateUrl: './timeperiods-view-details.component.html',
    styleUrl: './timeperiods-view-details.component.css'
})
export class TimeperiodsViewDetailsComponent implements OnInit, OnDestroy {

    public id: number = 0;
    public timeperiod: ViewDetailsTimeperiod = {
        id: 0,
        uuid: '',
        container_id: 0,
        name: '',
        description: '',
        calendar_id: 0,
        created: '',
        modified: '',
        timeperiod_timeranges: [],
        events: []
    };
    public user: User = {
        id: 0,
        usergroup_id: 0,
        email: '',
        firstname: '',
        lastname: '',
        position: null,
        company: null,
        phone: null,
        timezone: '',
        i18n: '',
        dateformat: '',
        samaccountname: null,
        ldap_dn: null,
        showstatsinmenu: 0,
        is_active: 0,
        dashboard_tab_rotation: 0,
        paginatorlength: 0,
        recursive_browser: 0,
        image: '',
        is_oauth: false,
        usercontainerroles_ldap: {} as UsercontainerrolesLdap
    };
    public i18n: string[] = [];
    public languageCode: string = 'en';
    public calendarOptions: CalendarOptions = {
        plugins: [timeGridPlugin],
        initialView: 'timeGridWeek',
        locale: this.languageCode,
        headerToolbar: false,
        slotMinTime: '00:00:00',
        slotMaxTime: '24:00:00',
        slotDuration: '01:00',
        allDaySlot: false,
        contentHeight: 'auto',
        dayHeaderFormat: {weekday: 'long'},
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            meridiem: 'short',
            hour12: false
        },
        slotLabelFormat: {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false
        },
        firstDay: 1, // monday as first day of the week
        editable: false,
        nowIndicator: true,
        displayEventTime: false,
        selectOverlap: true,
        events: this.timeperiod.events as EventInput[],
    };

    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private TimeperiodsService = inject(TimeperiodsService);
    private subscriptions: Subscription = new Subscription();

    ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        let request = {
            timeperiod: this.TimeperiodsService.getViewDetailsTimeperiod(this.id),
            user: this.TimeperiodsService.getUser()
        };

        this.subscriptions.add(forkJoin(request).subscribe(
            (result) => {
                this.timeperiod = result.timeperiod;
                this.user = result.user;

                this.i18n = this.user.i18n.split('_');
                if (this.i18n.length > 0) {
                    this.languageCode = this.i18n[0];
                }

                this.calendarOptions.locale = this.languageCode;
                this.calendarOptions.events = this.timeperiod.events as EventInput[];

            }));
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}
