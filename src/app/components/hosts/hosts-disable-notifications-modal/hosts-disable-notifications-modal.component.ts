import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
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
import {
    DowntimesDefaultsService,
    ValidateInput,
    ValidationErrors
} from '../../../services/downtimes-defaults.service';
import {
    ExternalCommandsService,
    HostDisableNotificationsItem
} from '../../../services/external-commands.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { RequiredIconComponent } from '../../required-icon/required-icon.component';


@Component({
    selector: 'oitc-hosts-disable-notifications-modal',
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
        FormsModule,
        NgSelectModule,
        RequiredIconComponent
    ],
    templateUrl: './hosts-disable-notifications-modal.component.html',
    styleUrl: './hosts-disable-notifications-modal.component.css'
})
export class HostsDisableNotificationsModalComponent implements OnInit, OnDestroy {
    @Input({required: true}) public items: HostDisableNotificationsItem[] = [];
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
        to_time: ''
    };

    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly DowntimesDefaultsService: DowntimesDefaultsService = inject(DowntimesDefaultsService);
    private readonly ExternalCommandsService: ExternalCommandsService = inject(ExternalCommandsService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly notyService: NotyService = inject(NotyService);

    private subscriptions: Subscription = new Subscription();
    public type: string ='hostOnly';
    @ViewChild('modal') private modal!: ModalComponent;

    hideModal() {
        this.isSend = false;
        this.hasErrors = false;
        this.currentIndex = 0;
        this.errors = {};

        this.modalService.toggle({
            show: false,
            id: 'hostDisableNotificationsModal'
        });
    }

    setExternalCommands() {
        this.error = false;
        this.isSend = true;
        this.currentIndex = 0;
        this.sendCommands();
    }


    ngOnInit() {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            if (state.id === 'hostDisableNotificationsModal' && state.show === true) {
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
            this.downtimeModal.from_date = this.createDateString(downtimeDefaults.js_from);
            this.downtimeModal.from_time = downtimeDefaults.from_time;
            this.downtimeModal.to_date = this.createDateString(downtimeDefaults.js_to);
            this.downtimeModal.to_time = downtimeDefaults.to_time;
            this.downtimeModal.comment = this.TranslocoService.translate(downtimeDefaults.comment);
        }));
    }


    createDateString = function (jsStringData: string) {
        let splitData = jsStringData.split(',');
        return splitData[0].trim() + '-' + splitData[1].trim() + '-' + splitData[2].trim()
    }

    sendCommands() {
        this.currentIndex = 0;
        this.items.forEach((element: HostDisableNotificationsItem) => {

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
                    this.hideModal();
                    this.completed.emit(true);
                    const title: string = this.TranslocoService.translate('Downtimes added');
                    const msg: string = this.TranslocoService.translate('Commands added successfully to queue');
                    this.notyService.genericSuccess(msg, title);
                }
            }));
        });
    }
}
