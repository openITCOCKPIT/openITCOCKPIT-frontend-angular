import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {
    ButtonCloseDirective,
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ProgressComponent,
    RowComponent,
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NotyService } from '../../../layouts/coreui/noty.service';
import {
    DowntimesDefaultsService,
    ValidateInput,
    ValidationErrors
} from '../../../services/downtimes-defaults.service';
import { ExternalCommandsService, HostDowntimeItem } from '../../../services/external-commands.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { RequiredIconComponent } from '../../required-icon/required-icon.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';


@Component({
    selector: 'oitc-hosts-maintenance-modal',
    standalone: true,
    imports: [
        ButtonCloseDirective,
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
        FormsModule,
        NgSelectModule,
        RequiredIconComponent,
        FormSelectDirective,
        XsButtonDirective
    ],
    templateUrl: './hosts-maintenance-modal.component.html',
    styleUrl: './hosts-maintenance-modal.component.css'
})
export class HostsMaintenanceModalComponent implements OnInit, OnDestroy {
    @Input({required: true}) public items: HostDowntimeItem[] = [];
    @Input({required: false}) public maintenanceMessage: string = '';
    @Input({required: false}) public helpMessage: string = '';
    @Output() completed = new EventEmitter<boolean>();
    public hasErrors: boolean = false;
    public currentIndex: number = 0;
    public errors?: ValidationErrors;
    public error: boolean = false;
    public isSend: boolean = false;
    public state?: any
    public downtimeModal = {
        comment: '',
        from_date: '',
        from_time: '',
        to_date: '',
        to_time: '',
        downtimetype_id: 0
    };

    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly DowntimesDefaultsService: DowntimesDefaultsService = inject(DowntimesDefaultsService);
    private readonly ExternalCommandsService: ExternalCommandsService = inject(ExternalCommandsService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly notyService: NotyService = inject(NotyService);

    private subscriptions: Subscription = new Subscription();
    @ViewChild('modal') private modal!: ModalComponent;

    hideModal() {
        this.isSend = false;
        this.hasErrors = false;
        this.currentIndex = 0;
        this.errors = {};

        this.modalService.toggle({
            show: false,
            id: 'hostMaintenanceModal'
        });
    }

    setExternalCommands() {
        this.error = false;
        this.isSend = true;
        this.currentIndex = 0;
        const validate: ValidateInput = {
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
                this.currentIndex = 0;
            }
            if (result.success) {
                const start = result.data.js_start;
                const end = result.data.js_end;
                this.items.forEach((element: HostDowntimeItem) => {
                    element.downtimetype = this.downtimeModal.downtimetype_id;
                    element.start = start;
                    element.end = end;
                });
                this.sendCommands();
            }
        }));
    }


    ngOnInit() {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            if (state.id === 'hostMaintenanceModal' && state.show === true) {
                this.getDefaults();
            }
        }));
        this.downtimeModal.comment = this.TranslocoService.translate('In progress');
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    getDefaults() {
        this.subscriptions.add(this.DowntimesDefaultsService.getDowntimesDefaultsConfiguration().subscribe(downtimeDefaults => {
            this.downtimeModal.downtimetype_id = downtimeDefaults.downtimetype_id
            this.downtimeModal.from_date = this.createDateString(downtimeDefaults.js_from);
            this.downtimeModal.from_time = downtimeDefaults.from_time;
            this.downtimeModal.to_date = this.createDateString(downtimeDefaults.js_to);
            this.downtimeModal.to_time = downtimeDefaults.to_time;
        }));
    }


    createDateString = function (jsStringData: string) {
        let splitData = jsStringData.split(',');
        return splitData[0].trim() + '-' + splitData[1].trim() + '-' + splitData[2].trim()
    }

    sendCommands() {
        this.currentIndex = 0;
        this.items.forEach((element: HostDowntimeItem) => {

            this.subscriptions.add(this.ExternalCommandsService.setExternalCommands([element]).subscribe((result: {
                message: any;
            }) => {
                //result.message: /nagios_module//cmdController line 256
                if (result.message) {
                    this.currentIndex++;
                } else {
                    this.notyService.genericError();
                }

                if (this.currentIndex === this.items.length) {
                    const title: string = this.TranslocoService.translate('Downtimes added');
                    const msg: string = this.TranslocoService.translate('Commands added successfully to queue');
                    this.notyService.genericSuccess(msg, title);
                    this.hideModal();
                    setTimeout(() => {
                        this.completed.emit(true);
                    }, 5000);
                }
            }));
        });
    }
}
