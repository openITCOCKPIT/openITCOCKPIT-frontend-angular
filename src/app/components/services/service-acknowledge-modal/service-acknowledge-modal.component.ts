import { TranslocoDirective,
    TranslocoService } from '@jsverse/transloco';
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
    ColComponent, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective,
    FormControlDirective,
    FormLabelDirective,
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
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { ServiceAcknowledgeItem, ExternalCommandsService } from '../../../services/external-commands.service';

@Component({
  selector: 'oitc-service-acknowledge-modal',
  standalone: true,
    imports: [
        TranslocoDirective,
        ModalComponent,
        ButtonCloseDirective,
        FaIconComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ButtonDirective,
        ModalFooterComponent,
        ModalBodyComponent,
        ColComponent,
        FormControlDirective,
        FormLabelDirective,
        FormTextDirective,
        NgIf,
        ReactiveFormsModule,
        RowComponent,
        FormsModule,
        DebounceDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective
    ],
  templateUrl: './service-acknowledge-modal.component.html',
  styleUrl: './service-acknowledge-modal.component.css'
})
export class ServiceAcknowledgeModalComponent implements OnDestroy {
    @Input({required: true}) public items: ServiceAcknowledgeItem[] = [];
    @Input({required: false}) public mAcknowledgeMessage: string = '';
    @Input({required: false}) public helpMessage: string = '';
    @Output() completed = new EventEmitter<boolean>();
    public isSend: boolean = false;
    public error:boolean = false;

    private readonly TranslocoService = inject(TranslocoService);
    private readonly modalService = inject(ModalService);
    private readonly notyService = inject(NotyService);
    private readonly ExternalCommandsService = inject(ExternalCommandsService);
    private subscriptions: Subscription = new Subscription();
    @ViewChild('modal') private modal!: ModalComponent;
    public ackModal = {
        comment: '',
        sticky: false,
        notify: false,
    };

    hideModal () {
        this.isSend = false;
        this.error = false;

        this.modalService.toggle({
            show: false,
            id: 'serviceAcknowledgeModal'
        });
    }

    setExternalCommands () {
        if(this.ackModal.comment === ''){
            this.error = true;
            return;
        }
        this.items.forEach((element: ServiceAcknowledgeItem) => {
            element.sticky = (this.ackModal.sticky) ? 2 : 0 ;
            element.notify = this.ackModal.notify;
            element.comment = this.ackModal.comment;
        });

        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(this.items).subscribe((result: { message: any; }) => {
            //result.message: /nagios_module//cmdController line 256
            if (result.message) {
                const title = this.TranslocoService.translate('Acknowledges added');
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

    ngOnDestroy () {
        this.subscriptions.unsubscribe();
    }

}
