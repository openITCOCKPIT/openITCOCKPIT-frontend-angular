import {
    AlertComponent,
    AlertHeadingDirective,
    ColComponent,
    FormLabelDirective,
    ModalService,
    RowComponent
} from '@coreui/angular';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    OnDestroy,
    signal,
    ViewChild
} from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BaseWidgetComponent } from '../../../../pages/dashboards/widgets/base-widget/base-widget.component';
import {
    ChangecalendarEvent,
    ChangeCalendarsIndex,
    EditChangecalendarRoot,
    getDefaultChangeCalendarsIndexParams
} from '../../pages/changecalendars/changecalendars.interface';
import {
    ChangecalendarsCalendarComponent
} from '../../components/changecalendars-calendar/changecalendars-calendar.component';
import { CalendarEvent } from '../../../../pages/calendars/calendars.interface';
import { ChangecalendarsService } from '../../pages/changecalendars/changecalendars.service';
import { SelectKeyValue, SelectKeyValueString } from '../../../../layouts/primeng/select.interface';
import { ChangecalendarWidgetService } from './changecalendar-widget.service';
import { ChangeCalendarWidgetPost, ChangecalendarWidgetResponse } from '../changecalendar-widget.interface';
import { MultiSelectComponent } from '../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { EventClickArg } from '@fullcalendar/core';
import { TimezoneService } from '../../../../services/timezone.service';
import { TimezoneObject } from '../../../../pages/services/timezone.interface';
import { ChangecalendarWidgetModalService } from '../changecalendar-widget-modal.service';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { parseInt } from 'lodash';
import { AnimationEvent } from '@angular/animations';

@Component({
    selector: 'oitc-changecalendar-widget',
    imports: [
        AlertComponent,
        AlertHeadingDirective,
        AsyncPipe,
        ColComponent,
        FaIconComponent,
        FormLabelDirective,
        NgIf,
        RowComponent,
        SelectComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        ChangecalendarsCalendarComponent,
        MultiSelectComponent
    ],
    templateUrl: './changecalendar-widget.component.html',
    styleUrl: './changecalendar-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangecalendarWidgetComponent extends BaseWidgetComponent implements OnDestroy, AfterViewInit {
    @ViewChild('changecalendarContainer') changecalendarContainer?: ElementRef;
    protected flipped = signal<boolean>(false);
    private readonly ChangecalendarsService: ChangecalendarsService = inject(ChangecalendarsService);
    private readonly ChangeCalendarWidgetService: ChangecalendarWidgetService = inject(ChangecalendarWidgetService);
    private readonly ModalService: ModalService = inject(ModalService);
    private readonly TimezoneService: TimezoneService = inject(TimezoneService);


    public changeCalendarId: number | null = null;
    public EditableChangecalendar: ChangecalendarWidgetResponse = {
        changeCalendars: {},
        displayType: 'dayGridMonth',
    };
    public events: CalendarEvent[] = [];
    public ChangeCalendars: SelectKeyValue[] = [];
    protected widgetConfig?: ChangeCalendarWidgetPost;
    public DisplayTypes: SelectKeyValueString[] = [
        {value: 'Month', key: 'dayGridMonth'},
        {value: 'Week', key: 'dayGridWeek'},
        {value: 'Day', key: 'timeGridDay'},
        {value: 'List', key: 'listWeek'},
    ];
    protected timezone!: TimezoneObject;
    protected event: ChangecalendarEvent = {
        title: '',
        description: '',
        start: '',
        end: '',
        changecalendar_id: 0,
    } as ChangecalendarEvent;
    protected post: EditChangecalendarRoot = {
        changeCalendar: {}
    } as EditChangecalendarRoot;

    private readonly ChangecalendarWidgetModalService: ChangecalendarWidgetModalService = inject(ChangecalendarWidgetModalService);

    public ngAfterViewInit(): void {
        this.getUserTimezone();
        this.resizeWidget();
    }

    private getUserTimezone() {
        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe(data => {
            this.timezone = data;
            this.cdr.markForCheck();
        }));
    }

    private stripZone(date: Date): string {

        let ZeroForMonth = (date.getMonth() + 1) < 10 ? '0' : '', ZeroForDay = date.getDate() < 10 ? '0' : '',
            ZeroForHour = date.getHours() < 10 ? '0' : '', ZeroForMinute = date.getMinutes() < 10 ? '0' : '',
            ZeroForSecond = date.getSeconds() < 10 ? '0' : '', Year = date.getFullYear(),
            Month = ZeroForMonth + (date.getMonth() + 1), Day = ZeroForDay + date.getDate(),
            Hour = ZeroForHour + date.getHours(), Minute = ZeroForMinute + date.getMinutes(),
            Second = ZeroForSecond + date.getSeconds(), Zone = this.timezone.user_offset / 60 / 60,
            ZeroForZone = Zone < 10 ? '0' : '', TimeZone = "+" + ZeroForZone + Zone,
            dS = Year + "-" + Month + "-" + Day + "T" + Hour + ":" + Minute + ":" + Second;

        return dS;
    }

    public override resizeWidget(event?: KtdResizeEnd) {
        this.load();

        this.cdr.markForCheck();
    }

    public override layoutUpdate(event: KtdGridLayout) {
    }

    public toggleChangecalendarModal(clickInfo: EventClickArg): void {
        // set this.event to the event from this.events where the originId matches clickInfo.event._def.extendedProps.originId
        this.event = this.events.find((event: CalendarEvent) => {
            return event.originId === clickInfo.event._def.extendedProps['originId'];
        }) as unknown as ChangecalendarEvent;
        if (this.event) {
            this.ChangecalendarWidgetModalService.openChangecalendarModal(this.event);
        }
    }

    public override load() {
        if (this.widget) {
            let widgetId = this.widget.id;
            this.subscriptions.add(
                this.ChangeCalendarWidgetService.loadWidgetConfig(widgetId).subscribe((response: ChangecalendarWidgetResponse) => {
                    this.EditableChangecalendar = response;

                    // Put data to POSTable object.
                    this.widgetConfig = {
                        changecalendar_ids: Object.keys(response.changeCalendars).map((key) => parseInt(key, 10)),
                        displayType: response.displayType,
                        Widget: {
                            id: widgetId
                        },
                    } as ChangeCalendarWidgetPost;

                    this.events = [];

                    Object.keys(response.changeCalendars).forEach((changeCalendarId: string) => {
                        response?.changeCalendars[changeCalendarId].changecalendar_events.forEach((event) => {
                            this.events.push({
                                originId: event.id,
                                title: event.title,
                                start: event.start,
                                description: event.description,
                                end: event.end,
                                default_holiday: false,
                                colour: response?.changeCalendars[changeCalendarId].colour,
                            });
                        });
                    });
                    this.cdr.markForCheck();
                })
            );
        }
    }

    protected loadChangecalendars = () => {
        this.subscriptions.add(this.ChangecalendarsService.getIndex(getDefaultChangeCalendarsIndexParams()).subscribe((result: ChangeCalendarsIndex) => {
            this.ChangeCalendars = [];
            result.all_changecalendars.forEach((changecalendar) => {
                this.ChangeCalendars.push({
                    key: changecalendar.id,
                    value: changecalendar.name
                });
            });
            this.cdr.markForCheck();
        }));
    }

    public saveWidgetConfig(): void {
        if (!this.widget) {
            return;
        }
        if (!this.widgetConfig) {
            return;
        }
        this.subscriptions.add(this.ChangeCalendarWidgetService.saveWidgetConfig(this.widget.id, this.widgetConfig).subscribe((response) => {
            // Close config
            this.flipped.set(false);

            // Reload sla widget
            this.load();
        }));
    }


    public show: boolean = true;

    public override onAnimationStart(event: AnimationEvent) {
        if (event.toState && this.ChangeCalendars.length === 0) {
            // "true" means show config.
            // Load initial Grafana Dashboards
            this.loadChangecalendars();
        }


        super.onAnimationStart(event);
    }


    public override onAnimationDone(event: AnimationEvent) {
        super.onAnimationDone(event);

        if (!event.toState) {
            // "false" means show content.

            // We have to remove the EVC from the DOM and re-add
            // otherwise the lines are not drawn correctly
            this.show = true;
            this.cdr.markForCheck();
        } else {
            // "true" means show config.
            // The animation has stopped, and we are in the config view - so we can now remove the EVC from the DOM
            // We hide the EVC case if we flip back to the content, the EVC is messed up and needs to be re-rendered
            this.show = false;
            this.cdr.markForCheck();
        }
    }
}
