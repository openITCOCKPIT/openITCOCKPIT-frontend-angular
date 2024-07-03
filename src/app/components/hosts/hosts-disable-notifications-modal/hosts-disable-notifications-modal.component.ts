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
import { TranslocoDirective } from '@jsverse/transloco';
import { NotyService } from '../../../layouts/coreui/noty.service';
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
    @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();
    public hasErrors: boolean = false;
    public currentIndex: number = 0;
    public error: boolean = false;
    public isSend: boolean = false;
    public state?: any

    private readonly ExternalCommandsService: ExternalCommandsService = inject(ExternalCommandsService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly subscriptions: Subscription = new Subscription();

    public type: string = 'hostOnly';
    @ViewChild('modal') private modal!: ModalComponent;

    hideModal() {
        this.isSend = false;
        this.hasErrors = false;
        this.currentIndex = 0;

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
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
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
                }
            }));
        });
    }
}
