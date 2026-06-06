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

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ExternalCommandsService, HostProcessCheckResultItem, } from '../../../services/external-commands.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'oitc-hosts-process-checkresult-modal',
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
        ReactiveFormsModule,
        RequiredIconComponent,
        RowComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        FormsModule
    ],
    templateUrl: './hosts-process-checkresult-modal.component.html',
    styleUrl: './hosts-process-checkresult-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostsProcessCheckresultModalComponent implements OnDestroy {
    @Input({required: true}) public items: HostProcessCheckResultItem[] = [];
    @Output() completed = new EventEmitter<boolean>();
    public isSend: boolean = false;
    public error: boolean = false;

    public state: 0 | 1 | 2 = 0;

    private readonly TranslocoService = inject(TranslocoService);
    private readonly modalService = inject(ModalService);
    private readonly notyService = inject(NotyService);
    private readonly ExternalCommandsService = inject(ExternalCommandsService);
    private subscriptions: Subscription = new Subscription();
    @ViewChild('modal') private modal!: ModalComponent;
    public processCheckresultModal = {
        state: 0,
        output: this.TranslocoService.translate('Test alert'),
        force_hardstate: false
    };

    private cdr = inject(ChangeDetectorRef);

    public hideModal() {
        this.isSend = false;
        this.error = false;

        this.cdr.markForCheck();

        this.modalService.toggle({
            show: false,
            id: 'hostProcessCheckresultModal'
        });
    }

    public setExternalCommands() {
        if (this.processCheckresultModal.output === '') {
            this.error = true;
            return;
        }


        this.items.forEach((element: HostProcessCheckResultItem) => {
            element.status_code = this.processCheckresultModal.state;
            element.plugin_output = this.processCheckresultModal.output;
            element.forceHardstate = this.processCheckresultModal.force_hardstate
        });

        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(this.items).subscribe((result: {
            message: any;
        }) => {
            //result.message: /nagios_module//cmdController line 256
            if (result.message) {
                const title = this.TranslocoService.translate('Check results added');
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
