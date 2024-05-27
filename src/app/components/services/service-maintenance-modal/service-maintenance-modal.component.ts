import {Component, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';
import {
    ButtonCloseDirective,
    ButtonDirective,
    ColComponent, FormControlDirective, FormLabelDirective, FormTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent, ModalHeaderComponent, ModalService, ModalTitleDirective, ProgressComponent, RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { MaintenanceItem, DisableResponse } from './service-maintenance.interface';


@Component({
  selector: 'oitc-service-maintenance-modal',
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
        FormLabelDirective
    ],
  templateUrl: './service-maintenance-modal.component.html',
  styleUrl: './service-maintenance-modal.component.css'
})
export class ServiceMaintenanceModalComponent {
    @Input({required: true}) public items: MaintenanceItem[] = [];
    @Input({required: false}) public maintenanceMessage: string = '';
    @Input({required: false}) public helpMessage: string = '';
    @Output() completed = new EventEmitter<boolean>();

    public isSend: boolean = false;
    public percentage: number = 0;
    public hasErrors: boolean = false;
    public errors: DisableResponse[] = [];

    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    @ViewChild('modal') private modal!: ModalComponent;

    hideModal() {
        this.isSend = false;
        this.percentage = 0;
        this.hasErrors = false;
        this.errors = [];

        this.modalService.toggle({
            show: false,
            id: 'serviceMaintenanceModal'
        });
    }

    send() {

    }
}
