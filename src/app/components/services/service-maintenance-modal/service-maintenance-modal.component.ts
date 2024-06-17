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
import {
    MaintenanceItem,
    ValidationErrors
} from './service-maintenance.interface';
import { TranslocoDirective,
    TranslocoService } from '@jsverse/transloco';
import { MAINTENANCE_SERVICE_TOKEN } from '../../../tokens/maintenance-injection.token';
import { NotyService } from '../../../layouts/coreui/noty.service';



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
    @Input({required: true}) public items: MaintenanceItem[] = [];
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
    private readonly modalService = inject(ModalService);
    private readonly notyService = inject(NotyService);
    private subscriptions: Subscription = new Subscription();
    @ViewChild('modal') private modal!: ModalComponent;

    constructor (@Inject(MAINTENANCE_SERVICE_TOKEN) private MaintenanceService: any) {
    }

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
        const validate = {
            comment: this.downtimeModal.comment,
            from_date: this.downtimeModal.from_date,
            from_time: this.downtimeModal.from_time,
            to_date: this.downtimeModal.to_date,
            to_time: this.downtimeModal.to_time
        }
        this.isSend = true;
        this.MaintenanceService.validateDowntimeInput(validate).subscribe((result: any) => {
            if (!result.success) {
                this.errors = result.data.Downtime;
                this.isSend = false;
            } else {
                const start =  result.data.js_start;
                const end =  result.data.js_end;
                this.items.forEach((element: MaintenanceItem) => {
                    element.start = start;
                    element.end = end;
                    element.comment = this.downtimeModal.comment;
                });
                this.MaintenanceService.setExternalCommands(this.items).subscribe((result: { message: any; }) => {
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
                });
            }
        });
    }


    ngOnInit () {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
        this.downtimeModal.comment = this.TranslocoService.translate('In progress');
        this.subscriptions.add(this.MaintenanceService.geDowntimeDefaults()
            .subscribe((result: { defaultValues: any; }) => {
                const defaults = result.defaultValues
                this.downtimeModal.from_date = this.createDateString(defaults.js_from);
                this.downtimeModal.from_time = defaults.from_time;
                this.downtimeModal.to_date = this.createDateString(defaults.js_to);
                this.downtimeModal.to_time = defaults.to_time;
            })
        );
        }));
    }

    ngOnDestroy () {
        this.subscriptions.unsubscribe();
    }


    createDateString = function (jsStringData: string) {
        let splitData = jsStringData.split(',');
        return  splitData[0].trim() + '-' + splitData[1].trim() + '-' + splitData[2].trim()
    }
}
