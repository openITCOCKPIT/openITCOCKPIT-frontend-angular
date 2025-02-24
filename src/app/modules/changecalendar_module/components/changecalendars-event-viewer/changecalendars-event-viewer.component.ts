import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    RowComponent
} from '@coreui/angular';
import { FormErrorDirective } from '../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { TrustAsHtmlPipe } from '../../../../pipes/trust-as-html.pipe';
import { ChangecalendarEvent } from '../../pages/changecalendars/changecalendars.interface';
import { BbCodeParserService } from '../../../../services/bb-code-parser.service';
import { GenericValidationError } from '../../../../generic-responses';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ChangecalendarWidgetModalService } from '../../widgets/changecalendar-widget-modal.service';
import { Subscription } from 'rxjs';
import { TimezoneConfiguration as TimezoneObject, TimezoneService } from '../../../../services/timezone.service';

@Component({
    selector: 'oitc-changecalendars-event-viewer',
    imports: [
        ModalComponent,
        ModalHeaderComponent,
        ModalBodyComponent,
        ModalFooterComponent,
        RowComponent,
        ColComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        ReactiveFormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        TranslocoPipe,
        TrustAsHtmlPipe,
        TranslocoDirective,
        FormsModule,
        FaIconComponent,
        XsButtonDirective,
        ModalTitleDirective,
    ],
    templateUrl: './changecalendars-event-viewer.component.html',
    styleUrl: './changecalendars-event-viewer.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangecalendarsEventViewerComponent implements OnInit, OnChanges {
    private readonly ModalService: ModalService = inject(ModalService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly BbCodeParserService: BbCodeParserService = inject(BbCodeParserService);
    private readonly ChangecalendarWidgetModalService: ChangecalendarWidgetModalService = inject(ChangecalendarWidgetModalService);
    private readonly subscriptions = new Subscription();
    private readonly TimezoneService: TimezoneService = inject(TimezoneService);
    private _event: ChangecalendarEvent = {} as ChangecalendarEvent;
    private _editable: boolean = true;

    @Output() onDeleteClick = new EventEmitter<ChangecalendarEvent>();
    @Output() onEventChange = new EventEmitter<ChangecalendarEvent>();
    @Output() onEventCreate = new EventEmitter<ChangecalendarEvent>();
    @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();

    protected html: string = '';
    protected errors?: GenericValidationError;
    protected timezone!: TimezoneObject;


    @Input()
    public set event(event: ChangecalendarEvent) {
        this._event = event;
    }

    public get event(): ChangecalendarEvent {
        return this._event;
    }

    @Input()
    public set editable(editable: boolean) {
        this._editable = editable;
    }

    public get editable(): boolean {
        return this._editable;
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

    public ngOnInit() {
        this.getUserTimezone();
        this.subscriptions.add(this.ChangecalendarWidgetModalService.event$.subscribe((event) => {
            this.event = event;
            this.event.start = this.stripZone(new Date(this.event.start));
            this.event.end = this.stripZone(new Date(this.event.end));


            this.html = this.BbCodeParserService.parse(this.event.description || '');
            this.cdr.markForCheck();

            // open modal
            // no idea why we need setTimeout here, but otherwise you can not open the modal on the dashboard
            // more than once
            setTimeout(() => {
                this.ModalService.toggle({
                    show: true,
                    id: 'changeCalendarViewerModal'
                });
            }, 150);
        }));
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.html = this.BbCodeParserService.parse(this.event.description || '');
    }

    public hideModal(): void {
        this.ModalService.toggle({
            show: false,
            id: 'changeCalendarViewerModal'
        })
    }
}
