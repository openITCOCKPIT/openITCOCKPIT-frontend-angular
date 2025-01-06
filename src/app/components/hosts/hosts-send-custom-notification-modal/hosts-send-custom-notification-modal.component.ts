import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    Output,
    ViewChild
} from '@angular/core';
import {
    ButtonCloseDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
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
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ExternalCommandsService, SendCustomNotificationItem } from '../../../services/external-commands.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'oitc-hosts-send-custom-notification-modal',
    imports: [
        ButtonCloseDirective,
        ColComponent,
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormLabelDirective,
        FormSelectDirective,
        FormTextDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NgIf,
        ReactiveFormsModule,
        RequiredIconComponent,
        RowComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        FormsModule
    ],
    templateUrl: './hosts-send-custom-notification-modal.component.html',
    styleUrl: './hosts-send-custom-notification-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostsSendCustomNotificationModalComponent implements OnDestroy {
    @Input({required: true}) public items: SendCustomNotificationItem[] = [];
    @Output() completed = new EventEmitter<boolean>();
    public isSend: boolean = false;
    public error: boolean = false;

    private readonly TranslocoService = inject(TranslocoService);
    private readonly modalService = inject(ModalService);
    private readonly notyService = inject(NotyService);
    private readonly ExternalCommandsService = inject(ExternalCommandsService);
    private subscriptions: Subscription = new Subscription();
    @ViewChild('modal') private modal!: ModalComponent;
    public sentNotificationModal = {
        comment: this.TranslocoService.translate('Test notification'),
        force: true,
        broadcast: false
    };
    private cdr = inject(ChangeDetectorRef);

    public hideModal() {
        this.isSend = false;
        this.error = false;

        this.cdr.markForCheck();

        this.modalService.toggle({
            show: false,
            id: 'hostSendCustomNotificationModal'
        });
    }

    public setExternalCommands() {
        if (this.sentNotificationModal.comment === '') {
            this.error = true;
            return;
        }

        let options: 0 | 1 | 2 | 3 = 0;
        if (this.sentNotificationModal.force) {
            options = 1;
        }
        if (this.sentNotificationModal.broadcast) {
            options = 2;
        }
        if (this.sentNotificationModal.force && this.sentNotificationModal.broadcast) {
            options = 3;
        }

        this.items.forEach((element: SendCustomNotificationItem) => {
            element.comment = this.sentNotificationModal.comment;
            element.options = options;
        });

        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(this.items).subscribe((result: {
            message: any;
        }) => {
            //result.message: /nagios_module//cmdController line 256
            if (result.message) {
                const title = this.TranslocoService.translate('Notification send');
                const msg = this.TranslocoService.translate('Commands added successfully to queue');

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

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
