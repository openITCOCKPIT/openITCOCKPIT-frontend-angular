import { NgFor } from '@angular/common';
import {
    Component,
    EventEmitter,
    Inject,
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
    ValidationErrors
} from '../../../services/downtimes-defaults.service';
import {
    ExternalCommandsService, HostRescheduleItem,
    ServiceResetItem
} from '../../../services/external-commands.service';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { NgSelectModule } from '@ng-select/ng-select';
import { RequiredIconComponent } from '../../required-icon/required-icon.component';


@Component({
    selector: 'oitc-service-reset-checktime-modal',
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
        SelectComponent,
        NgSelectModule,
        RequiredIconComponent
    ],
    templateUrl: './service-reset-checktime-modal.component.html',
    styleUrl: './service-reset-checktime-modal.component.css'
})
export class ServiceResetChecktimeModalComponent implements OnInit, OnDestroy {
    @Input({required: true}) public items: HostRescheduleItem[] = [];
    @Input({required: false}) public helpMessage: string = '';
    @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('modal') private modal!: ModalComponent;
    public hasErrors: boolean = false;
    public errors?: ValidationErrors;
    public error: boolean = false;
    public isSend: boolean = false;
    public state?: any

    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly ExternalCommandsService: ExternalCommandsService = inject(ExternalCommandsService);
    private readonly subscriptions: Subscription = new Subscription();

    protected resetType: number = 1;

    hideModal() {
        this.isSend = false;
        this.hasErrors = false;
        this.errors = {};

        this.modalService.toggle({
            show: false,
            id: 'serviceResetChecktimeModal'
        });
    }

    setExternalCommands() {
        this.sendCommands();
    }


    ngOnInit() {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            if (state.id === 'serviceResetChecktimeModal' && state.show === true) {
            }
        }));
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    sendCommands(): void {
        this.error = false;
        this.isSend = true;
        this.items.forEach((item) => {
            if (this.resetType === 1) {
                item.type = 'hostOnly';
            }
            if (this.resetType === 2) {
                item.type = 'hostAndServices';
            }
        });
        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(this.items).subscribe((result: {
            message: any;
        }) => {
            //result.message: /nagios_module//cmdController line 256
            if (result.message) {

                this.hideModal();
                this.completed.emit(true);
            } else {
                this.notyService.genericError();
                this.hideModal();
            }
        }));
    }
}
