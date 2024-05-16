import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { CalendarComponent } from '../calendar/calendar.component';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckInputDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { CalendarContainer, CalendarEvent, CalendarPost, Countries } from '../calendars.interface';
import { GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { CalendarsService } from '../calendars.service';
import { forkJoin, Subscription } from 'rxjs';

@Component({
    selector: 'oitc-calendars-edit',
    standalone: true,
    imports: [
        BackButtonDirective,
        CalendarComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        FormCheckInputDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        NgSelectModule,
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        NgOptionHighlightModule
    ],
    templateUrl: './calendars-edit.component.html',
    styleUrl: './calendars-edit.component.css'
})
export class CalendarsEditComponent implements OnInit, OnDestroy {

    public post: CalendarPost = {
        id: 0,
        container_id: null,
        name: '',
        description: '',
        events: []
    }

    public containers: CalendarContainer[] = [];
    public countries: Countries = {};
    public errors: GenericValidationError | null = null;

    public events: CalendarEvent[] = [];
    public countryCode: string = 'de';

    private CalendarsService = inject(CalendarsService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private router = inject(Router);
    private route = inject(ActivatedRoute)

    private subscriptions: Subscription = new Subscription();

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

        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.CalendarsService.getEdit(id)
            .subscribe((result) => {
                this.post = result.calendar;
                this.events = result.events;
            }));

    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public setCountryCodeAndLoadHolidays(code: string) {
        this.countryCode = code;
        this.loadHolidays();
    }

    public loadHolidays() {
        this.subscriptions.add(this.CalendarsService.getHolidays(this.countryCode)
            .subscribe((result) => {

                // Keep custom events
                let oldEvents = this.events;
                let customEvents = oldEvents.filter(event => !event.default_holiday);

                // Add new events, but check for duplicates
                for (let event of result) {
                    if (!customEvents.find(customEvent => customEvent.start === event.start)) {
                        customEvents.push(event);
                    }
                }

                // customEvents contains now all events (custom and normal holidays
                this.events = customEvents;
            })
        );
    }

    public submit() {

        this.post.events = this.events;

        this.subscriptions.add(this.CalendarsService.updateCalendar(this.post)
            .subscribe((result) => {
                if (result.success) {
                    const title = this.TranslocoService.translate('Calendar');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['calendars', 'edit', this.post.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.router.navigate(['/calendars/index']);

                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            })
        );
    }

}
