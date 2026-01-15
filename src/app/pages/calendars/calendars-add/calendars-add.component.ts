import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackButtonDirective } from '../../../directives/back-button.directive';

import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { CalendarContainer, CalendarEvent, CalendarPost, Countries } from '../calendars.interface';
import { NgSelectModule } from '@ng-select/ng-select';

import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { FullCalendarModule } from '@fullcalendar/angular';
import { forkJoin, Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { CalendarsService } from '../calendars.service';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';

import { CalendarComponent } from '../calendar/calendar.component';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-calendars-add',
    imports: [
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
        XsButtonDirective,
        CardBodyComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        CardFooterComponent,
        NgSelectModule,
        NgOptionHighlightDirective,
        FullCalendarModule,
        FormCheckInputDirective,
        CalendarComponent
    ],
    templateUrl: './calendars-add.component.html',
    styleUrl: './calendars-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarsAddComponent implements OnInit, OnDestroy {

    public post = this.getClearForm();
    public createAnother: boolean = false;

    public containers: CalendarContainer[] = [];
    public countries: Countries = {};
    public errors: GenericValidationError | null = null;

    public events: CalendarEvent[] = [];
    public countryCode: string = 'de';

    private CalendarsService = inject(CalendarsService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    public getClearForm(): CalendarPost {
        return {
            container_id: null,
            name: "",
            description: "",
            events: []
        }
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
                this.cdr.markForCheck();
            });

        this.loadHolidays();
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
                this.cdr.markForCheck();
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
                this.cdr.markForCheck();
            })
        );
    }


    public submit() {
        this.post.events = this.events;
        this.subscriptions.add(this.CalendarsService.createCalendar(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('Calendar');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['calendars', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/calendars/index']);
                        return;
                    }

                    // Create another
                    this.post = this.getClearForm();
                    this.events = [];
                    this.errors = null;
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();

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
