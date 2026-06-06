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
    CardBodyComponent,
    CardComponent,
    CardTitleDirective,
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
    RowComponent
} from '@coreui/angular';
import { FormErrorDirective } from '../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { BbCodeEditorComponent } from '../../../../pages/documentations/bb-code-editor/bb-code-editor.component';
import { TrustAsHtmlPipe } from '../../../../pipes/trust-as-html.pipe';
import { ChangecalendarEvent } from '../../pages/changecalendars/changecalendars.interface';
import { BbCodeParserService } from '../../../../services/bb-code-parser.service';
import { GenericValidationError } from '../../../../generic-responses';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';


@Component({
    selector: 'oitc-changecalendars-event-editor',
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
        BbCodeEditorComponent,
        TrustAsHtmlPipe,
        TranslocoDirective,
        FormsModule,
        FaIconComponent,
        XsButtonDirective,
        CardTitleDirective,
        CardBodyComponent,
        CardComponent
    ],
    templateUrl: './changecalendars-event-editor.component.html',
    styleUrl: './changecalendars-event-editor.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangecalendarsEventEditorComponent implements OnInit, OnChanges {
    private readonly ModalService: ModalService = inject(ModalService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly BbCodeParserService: BbCodeParserService = inject(BbCodeParserService);
    private _event: ChangecalendarEvent = {} as ChangecalendarEvent;

    @Output() onDeleteClick = new EventEmitter<ChangecalendarEvent>();
    @Output() onEventChange = new EventEmitter<ChangecalendarEvent>();
    @Output() onEventCreate = new EventEmitter<ChangecalendarEvent>();

    protected html: string = '';
    protected errors?: GenericValidationError;

    @Input()
    public set event(event: ChangecalendarEvent) {
        this._event = event;
    }

    public get event(): ChangecalendarEvent {
        return this._event;
    }

    protected onChangeOfBbCode(event: any): void {
        this.html = this.BbCodeParserService.parse(this.event.description);
    }

    protected showModal(): void {
        this.ModalService.toggle({
            show: true,
            id: 'changeCalendarEditorModal'
        });
        this.cdr.markForCheck();
    }

    public ngOnInit() {
        this.html = this.BbCodeParserService.parse(this.event.description);
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.html = this.BbCodeParserService.parse(this.event.description);
    }

    public hideModal(): void {
        this.ModalService.toggle({
            show: false,
            id: 'changeCalendarEditorModal'
        })
    }
}
