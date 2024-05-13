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
    CardTitleDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
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
import { CalendarContainer, CalendarHoliday, CalendarPost, Countries } from '../calendars.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { forkJoin, Subscription } from 'rxjs';
import { CalendarsService } from '../calendars.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FullCalendarComponent } from '../../../components/full-calendar/full-calendar.component';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import $ from "jquery";


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

    public calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        navLinks: false, // can click day/week names to navigate views
        businessHours: true, // display business hours
        editable: true,
        weekNumbers: true,
        weekNumberCalculation: 'ISO',
        eventOverlap: false,
        eventDurationEditable: false,
        //'interaction', 'dayGrid', 'timeGrid', 'list'
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
        customButtons: {
            holidays: {
                text: this.TranslocoService.translate('Add holiday'),
                click: (ev: any) => {
                    this.clickButtonTest();
                }
            },
            deleteallholidays: {
                text: this.TranslocoService.translate('Delete ALL holidays'),
                click: () => {
                    alert('Delete All Holidays');
                }
            },
            deletemonthevents: {
                text: this.TranslocoService.translate('Delete MONTH events'),
                click: () => {
                    alert('Delete Month Events');
                }
            },
            deleteallevents: {
                text: this.TranslocoService.translate('Delete ALL events'),
                click: () => {
                    alert('Delete All Events');
                }
            }

        },
        headerToolbar: {
            left: 'holidays deleteallholidays deletemonthevents deleteallevents',
            center: 'title',
            right: 'prev,next today',
        },

        dayCellDidMount: (info: any) => {
            //console.log(info);
            //info.el.innerHTML += '<button class="btn btn-success btn-xs btn-icon"><fa-icon [icon]="[\'fas\', \'plus\']"></fa-icon></button>';
            //info.el.innerHTML += '<button class="btn btn-primary btn-xs btn-icon fs-6 px-2 me-1">&#9998;</button>';
            //info.el.innerHTML += '<button class="btn btn-danger btn-xs btn-icon fs-6 px-2">&cross;</button>';
            //info.el.style.padding = "20px 0 0 10px";
            console.log('add button');
        },
        navLinkDayClick: (date: any) => {
            console.log('navLinkDayClick');
            console.log(date);
        },
        dateClick: (info: any) => {
            console.log('dateClick');
            //console.log(info.events);
        },
        eventClick: (info: any) => {
            console.log('eventClick');
            //console.log(info);
        },
        datesSet: (info: any) => {
            //console.log(info);
            console.log('datesSet');


            //info.el.innerHTML += '<button class="btn btn-success btn-xs btn-icon fs-6 px-2 me-1" type="button" (onClick)="alert(info);">&plus;</button>';
            $(".fc-daygrid-day-number").each((index, obj) => {
                //obj = fc-day-number <span>
                let $div = $(obj);
                let $parentTd = $($div.parents('td')[0]);

                let currentDate = $parentTd.data('date');

                let $addButton = $('<button>')
                    .html('&plus;')
                    .attr({
                        title: 'add',
                        type: 'button',
                        class: 'btn btn-success btn-xs btn-icon fs-6 px-2',
                        date: currentDate
                    })
                    .on('click', (ev) => {
                            // jQuery like its 2012 again
                            const date = String($(ev.currentTarget).attr('date'));
                            this.addEventClickButton(date);
                            /*
                                $('#addEventModal').modal('show');
                                $scope.newEvent = {
                                    title: '',
                                    start: currentDate
                                };

                             */
                        }
                    );
                $parentTd.css('text-align', 'right').append($addButton);

                if (!this.hasEvents(currentDate)) {
                    $parentTd.css('text-align', 'right').append($addButton);
                }
            });

            //var events = $scope.getEvents(currentDate);
            /*
             if(!$scope.hasEvents(currentDate)){
                 $parentTd.css('text-align', 'right').append($addButton);
             }

             */
        },
        eventDidMount: (info: any) => {
            console.log('eventDidMount');
            //console.log(info);
        },
        eventDrop: (info: any) => {
            /*
            const event = this.deleteEvent(info.oldEvent.start);
            if(!event) {
                return;
            }
            event = event[0];
            //Set new start date
            event.start = info.event.start;

             */
            console.log(info);
        },
        events: []
    };

    public clickButtonTest() {
        console.log('Hier wurde was angeklcikt!!');
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


                $(".fc-holidays-button")
                    .wrap("<span class='dropdown'></span>")
                    .addClass('btn btn-secondary dropdown-toggle')
                    .attr({
                        'data-toggle': 'dropdown',
                        'type': 'button',
                        'aria-expanded': false,
                        'aria-haspopup': true
                    })
                    .append($('<span/>', {'class': 'mx-1 fi fi-' + this.countryCode}))
                    .append('<span class="caret caret-with-margin-left-5"></span>');

                $('.fc-holidays-button')
                    .parent().append(
                    $('<ul/>', {
                            'id': 'countryList',
                            'class': 'dropdown-menu',
                            'role': 'button'
                        }
                    )
                );

                for (var key in this.countries) {
                    $('#countryList').append(
                        $('<li/>', {
                            data: {
                                'language': key
                            }
                        }).on("click", (ev) => {
                            this.setSelected($(ev.currentTarget).data('language'));
                        })
                            .append(
                                $('<a/>', {
                                    // 'class': 'dropdown-item'
                                }).append(
                                    $('<span/>', {
                                        'class': 'mx-1 fi fi-' + key
                                    })
                                ).append(
                                    $('<span/>', {
                                        'class': 'padding-left-5',
                                        'text': this.countries[key]
                                    })
                                )
                            )
                    );
                }

            });

        this.loadHolidays();
    }

    public setSelected(countryCode: string) {
        this.countryCode = countryCode;
        this.loadHolidays();
    }

    public ngOnDestroy(): void {
    }


    public loadHolidays() {
        this.subscriptions.add(this.CalendarsService.getHolidays(this.countryCode)
            .subscribe((result) => {
                this.calendarOptions.events = result;
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


    private deleteEvent(start: Date | null) {

    }

    public addEventClickButton(date: string) {
        console.log('addEventClickButton für', date);
    }

    public hasEvents(date: string) {
        for (var index in this.events) {
            if (this.events[index].start === date) {
                return true;
            }
        }
        return false;
    }


}
