import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output
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
    ProgressComponent,
    RowComponent,
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ValidationErrors } from '../../../services/downtimes-defaults.service';
import { ExternalCommandsService, HostRescheduleItem, } from '../../../services/external-commands.service';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RequiredIconComponent } from '../../required-icon/required-icon.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';


@Component({
    selector: 'oitc-service-reset-checktime-modal',
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
        SelectComponent,
        NgSelectModule,
        RequiredIconComponent,
        FormSelectDirective,
        XsButtonDirective
    ],
    templateUrl: './service-reset-checktime-modal.component.html',
    styleUrl: './service-reset-checktime-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceResetChecktimeModalComponent implements OnInit, OnDestroy {

    /* This component is used to reset the check time of an HOST - the naming is bad */

    @Input({required: true}) public items: HostRescheduleItem[] = [];
    @Input({required: false}) public helpMessage: string = '';
    @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();
    public hasErrors: boolean = false;
    public errors?: ValidationErrors;
    public error: boolean = false;
    public isSend: boolean = false;
    public state?: any

    private readonly modalService: ModalService = inject(ModalService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly ExternalCommandsService: ExternalCommandsService = inject(ExternalCommandsService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);

    protected resetType: 'hostOnly' | 'hostAndServices' = 'hostAndServices';

    private cdr = inject(ChangeDetectorRef);

    public hideModal() {
        this.isSend = false;
        this.hasErrors = false;
        this.errors = {};

        this.cdr.markForCheck();

        this.modalService.toggle({
            show: false,
            id: 'serviceResetChecktimeModal'
        });
    }

    public ngOnInit() {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            if (state.id === 'serviceResetChecktimeModal' && state.show === true) {
            }
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public sendCommands(): void {
        this.error = false;
        this.isSend = true;
        this.items.forEach((item) => {
            item.type = this.resetType;
        });
        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(this.items).subscribe((result: {
            message: any;
        }) => {
            //result.message: /nagios_module//cmdController line 256
            if (result.message) {
                const title = this.TranslocoService.translate('Reset check time');
                const msg = this.TranslocoService.translate('Command sent successfully. Refresh in 5 seconds');
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
