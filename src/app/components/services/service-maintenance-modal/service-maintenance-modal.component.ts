import { Component,
    EventEmitter,
    Inject,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild } from '@angular/core';
import {
    ButtonCloseDirective,
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    FormTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ProgressComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { DowntimesDefaultsService, ValidateInput, ValidationErrors } from '../../../services/downtimes-defaults.service';
import { ServiceDowntimeItem, ExternalCommandsService } from '../../../services/external-commands.service';


@Component({
    selector: 'oitc-service-maintenance-modal',
    standalone: true,
    imports: [
        ButtonCloseDirective,
        ButtonDirective,
        ColComponent,
        FaIconComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NgForOf,
        NgIf,
        ProgressComponent,
        RowComponent,
        TranslocoDirective,
        FormTextDirective,
        FormControlDirective,
        FormLabelDirective,
        FormsModule
    ],
    templateUrl: './service-maintenance-modal.component.html',
    styleUrl: './service-maintenance-modal.component.css'
})
export class ServiceMaintenanceModalComponent implements OnInit, OnDestroy {
    @Input({required: true}) public items: ServiceDowntimeItem[] = [];
    @Input({required: false}) public maintenanceMessage: string = '';
    @Input({required: false}) public helpMessage: string = '';
    @Output() completed = new EventEmitter<boolean>();
    public hasErrors: boolean = false;
    public errors?: ValidationErrors;
    public error: boolean = false;
    public isSend: boolean = false;
    public state?: any
    public downtimeModal = {
        comment: '',
        from_date: '',
        from_time: '',
        to_date: '',
        to_time: ''
    };

    private readonly TranslocoService = inject(TranslocoService);
    private readonly DowntimesDefaultsService = inject(DowntimesDefaultsService);
    private readonly ExternalCommandsService = inject(ExternalCommandsService);
    private readonly modalService = inject(ModalService);
    private readonly notyService = inject(NotyService);

    private subscriptions: Subscription = new Subscription();
    @ViewChild('modal') private modal!: ModalComponent;

    hideModal () {
        this.isSend = false;
        this.hasErrors = false;
        this.errors = {};

        this.modalService.toggle({
            show: false,
            id: 'serviceMaintenanceModal'
        });
    }

    setExternalCommands () {
        this.error = false;
        this.isSend = true;
        const validate : ValidateInput = {
            comment: this.downtimeModal.comment,
            from_date: this.downtimeModal.from_date,
            from_time: this.downtimeModal.from_time,
            to_date: this.downtimeModal.to_date,
            to_time: this.downtimeModal.to_time
        }
        this.isSend = true;
        this.subscriptions.add(this.DowntimesDefaultsService.validateDowntimesInput(validate).subscribe((result: any) => {

            if (!result.success) {
                this.errors = result.data.Downtime;
                this.isSend = false;
            }
            if (result.success) {
                const start = result.data.js_start;
                const end = result.data.js_end;
                this.items.forEach((element: ServiceDowntimeItem) => {
                    element.start = start;
                    element.end = end;
                    element.comment = this.downtimeModal.comment;
                });
                this.sendCommands();
            }
        }));
    }


    ngOnInit () {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            if(state.id === 'serviceMaintenanceModal' && state.show === true) {
                this.getDefaults();
            }
        }));
        this.downtimeModal.comment = this.TranslocoService.translate('In progress');
    }

    ngOnDestroy () {
        this.subscriptions.unsubscribe();
    }

    getDefaults() {
        this.subscriptions.add(this.DowntimesDefaultsService.getDowntimesDefaultsConfiguration().subscribe(downtimeDefaults => {
            this.downtimeModal.from_date = this.createDateString(downtimeDefaults.js_from);
            this.downtimeModal.from_time = downtimeDefaults.from_time;
            this.downtimeModal.to_date = this.createDateString(downtimeDefaults.js_to);
            this.downtimeModal.to_time = downtimeDefaults.to_time;
            this.downtimeModal.comment = this.TranslocoService.translate(downtimeDefaults.comment);
        }));
    }


    createDateString = function (jsStringData: string) {
        let splitData = jsStringData.split(',');
        return  splitData[0].trim() + '-' + splitData[1].trim() + '-' + splitData[2].trim()
    }

    sendCommands() {
        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(this.items).subscribe((result: { message: any; }) => {
            //result.message: /nagios_module//cmdController line 256
            if (result.message) {
                const title = this.TranslocoService.translate('Downtimes added');
                const msg = this.TranslocoService.translate('Commands added successfully to queue');

                this.notyService.genericSuccess(msg, title);
                this.hideModal();
                this.completed.emit(true);
            } else {
                this.notyService.genericError();
                this.hideModal();
            }
        }));
    }
}
