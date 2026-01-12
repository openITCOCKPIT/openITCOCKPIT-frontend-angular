import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
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
  RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

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
    imports: [
    ButtonCloseDirective,
    ColComponent,
    FaIconComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
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
    styleUrl: './hosts-maintenance-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostsMaintenanceModalComponent implements OnInit, OnDestroy {
    @Input({required: true}) public items: HostDowntimeItem[] = [];
    @Input({required: false}) public maintenanceMessage: string = '';
    @Input({required: false}) public helpMessage: string = '';
    @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();
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
        to_time: '',
        downtimetype_id: 0
    };

    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly DowntimesDefaultsService: DowntimesDefaultsService = inject(DowntimesDefaultsService);
    private readonly ExternalCommandsService: ExternalCommandsService = inject(ExternalCommandsService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly notyService: NotyService = inject(NotyService);

    private subscriptions: Subscription = new Subscription();

    private cdr = inject(ChangeDetectorRef);

    @ViewChild('modal') private modal!: ModalComponent;

    public hideModal(): void {
        this.isSend = false;
        this.hasErrors = false;
        this.errors = {};

        this.cdr.markForCheck();

        this.modalService.toggle({
            show: false,
            id: 'hostMaintenanceModal'
        });
    }

    public setExternalCommands(): void {
        this.error = false;
        this.isSend = true;
        const validate: ValidateInput = {
            comment: this.downtimeModal.comment,
            from_date: this.downtimeModal.from_date,
            from_time: this.downtimeModal.from_time,
            to_date: this.downtimeModal.to_date,
            to_time: this.downtimeModal.to_time
        }
        this.isSend = true;
        this.subscriptions.add(this.DowntimesDefaultsService.validateDowntimesInput(validate).subscribe((result: any): void => {
            this.cdr.markForCheck();
            if (!result.success) {
                this.errors = result.data.Downtime;
                this.isSend = false;
            }
            if (result.success) {
                const start = result.data.js_start;
                const end = result.data.js_end;
                this.items.forEach((element: HostDowntimeItem): void => {
                    element.downtimetype = this.downtimeModal.downtimetype_id;
                    element.start = start;
                    element.end = end;
                    element.comment = this.downtimeModal.comment;
                });
                this.sendCommands();
            }
        }));
    }


    public ngOnInit(): void {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            if (state.id === 'hostMaintenanceModal' && state.show === true) {
                this.getDefaults();
            }
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public getDefaults(): void {
        this.subscriptions.add(this.DowntimesDefaultsService.getDowntimesDefaultsConfiguration().subscribe(downtimeDefaults => {
            this.downtimeModal.downtimetype_id = downtimeDefaults.downtimetype_id
            this.downtimeModal.from_date = this.createDateString(downtimeDefaults.js_from);
            this.downtimeModal.from_time = downtimeDefaults.from_time;
            this.downtimeModal.to_date = this.createDateString(downtimeDefaults.js_to);
            this.downtimeModal.to_time = downtimeDefaults.to_time;
            this.downtimeModal.comment = downtimeDefaults.comment;
            this.cdr.markForCheck();
        }));
    }


    public createDateString = function (jsStringData: string): string {
        let splitData: string[] = jsStringData.split(',');
        return splitData[0].trim() + '-' + splitData[1].trim() + '-' + splitData[2].trim()
    }

    public sendCommands(): void {
        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(this.items).subscribe((result: {
            message: any;
        }) => {
            //result.message: /nagios_module//cmdController line 256
            if (result.message) {
                const title: string = this.TranslocoService.translate('Downtimes added');
                const msg: string = this.TranslocoService.translate('Commands added successfully to queue');

                this.notyService.genericSuccess(msg, title);
                this.hideModal();
                setTimeout(() => {
                    this.completed.emit(true);
                }, 5000);
            } else {
                this.notyService.genericError();
                this.hideModal();
            }
        }));
    }
}
