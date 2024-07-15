import { Component, EventEmitter, inject, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import {
    ButtonCloseDirective,
    ButtonDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
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
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ExternalCommandsService, ServiceAcknowledgeItem } from '../../../services/external-commands.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'oitc-host-acknowledge-modal',
    standalone: true,
    imports: [
        ButtonCloseDirective,
        ButtonDirective,
        ColComponent,
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormLabelDirective,
        FormTextDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NgIf,
        ReactiveFormsModule,
        RowComponent,
        TranslocoDirective
    ],
    templateUrl: './host-acknowledge-modal.component.html',
    styleUrl: './host-acknowledge-modal.component.css'
})
export class HostAcknowledgeModalComponent implements OnDestroy {
    @Input({required: true}) public items: ServiceAcknowledgeItem[] = [];
    @Input({required: false}) public mAcknowledgeMessage: string = '';
    @Input({required: false}) public helpMessage: string = '';
    @Output() completed = new EventEmitter<boolean>();
    public isSend: boolean = false;
    public error: boolean = false;

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

    hideModal() {
        this.isSend = false;
        this.error = false;

        this.modalService.toggle({
            show: false,
            id: 'hostAcknowledgeModal'
        });
    }

    setExternalCommands() {
        if (this.ackModal.comment === '') {
            this.error = true;
            return;
        }

        // 2 = sticky with Nagios Core, 1 = Sticky with Naemon Core, 2 works for both :)
        const NON_STICKY = 0;
        const STICKY = 2;

        this.items.forEach((element: ServiceAcknowledgeItem) => {
            element.sticky = (this.ackModal.sticky) ? STICKY : NON_STICKY;
            element.notify = this.ackModal.notify;
            element.comment = this.ackModal.comment;
        });

        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(this.items).subscribe((result: {
            message: any;
        }) => {
            //result.message: /nagios_module//cmdController line 256
            if (result.message) {
                const title = this.TranslocoService.translate('Acknowledges added');
                const msg = this.TranslocoService.translate('Commands added successfully to queue');

                this.notyService.genericSuccess(msg, title);
                this.hideModal();
                setTimeout(() => {
                    this.completed.emit(true);
                }, 3500);
                // this.completed.emit(true);
            } else {
                this.notyService.genericError();
                this.hideModal();
            }
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
