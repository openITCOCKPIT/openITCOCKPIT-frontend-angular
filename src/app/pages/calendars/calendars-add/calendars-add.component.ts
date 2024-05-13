import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Router, RouterLink } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective, ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent, RowComponent
} from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { UserMacrosModalComponent } from '../../commands/user-macros-modal/user-macros-modal.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { CalendarContainer, CalendarHoliday, CalendarPost, Countries } from '../calendars.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { forkJoin, observable, Observable, Subscription } from 'rxjs';
import { CalendarsService } from '../calendars.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FullCalendarComponent } from '../../../components/full-calendar/full-calendar.component';

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
        FullCalendarComponent
    ],
    templateUrl: './calendars-add.component.html',
    styleUrl: './calendars-add.component.css'
})
export class CalendarsAddComponent implements OnInit, OnDestroy {
    public post: CalendarPost = {
        container_id: 0,
        name: "",
        description: "",
        events: []
    }
    public containers: CalendarContainer[] = [];
    public countries: Countries = {};
    public events: CalendarHoliday[] = [];
    public errors: GenericValidationError | null = null;
    public defaultDate = new Date();
    public countryCode = 'de';


    private CalendarsService = inject(CalendarsService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private router = inject(Router);

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

        this.loadHolidays();
    }

    public ngOnDestroy(): void {
    }


    public loadHolidays() {
        this.subscriptions.add(this.CalendarsService.getHolidays(this.countryCode)
            .subscribe((result) => {
                this.events = result;
            })
        );
    }

    public submit() {
        this.subscriptions.add(this.CalendarsService.createCalendar(this.post)
            .subscribe((result) => {
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('Calendar');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['calendars', 'edit', response.id];

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
