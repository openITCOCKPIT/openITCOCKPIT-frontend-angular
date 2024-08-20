import { Component, EventEmitter, inject, Input, OnChanges, Output, ViewChild } from '@angular/core';
import {
    ButtonCloseDirective,
    CardBodyComponent,
    CardComponent,
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
import { TranslocoDirective } from '@jsverse/transloco';
import { NgSelectModule } from '@ng-select/ng-select';
import { RequiredIconComponent } from '../../required-icon/required-icon.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { RouterLink } from '@angular/router';


@Component({
    selector: 'oitc-service-add-to-servicegroup-modal',
    standalone: true,
    imports: [
        ButtonCloseDirective,
        XsButtonDirective,
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
        RequiredIconComponent,
        FormSelectDirective,
        CardComponent,
        CardBodyComponent,
        RouterLink
    ],
    templateUrl: './service-add-to-servicegroup-modal.component.html',
    styleUrl: './service-add-to-servicegroup-modal.component.css'
})
export class ServiceAddToServicegroupModalComponent implements OnChanges {
    @Input({required: true}) public items: SelectKeyValue[] = [];
    @Input({required: false}) public maintenanceMessage: string = '';
    @Input({required: false}) public helpMessage: string = '';
    @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();
    private readonly modalService: ModalService = inject(ModalService);
    protected hasErrors: boolean = false;
    protected isSend: boolean = false;
    protected joinedServiceIds: string = '';
    protected state?: any
    protected type: string = 'serviceOnly';
    @ViewChild('modal') private modal!: ModalComponent;

    public hideModal() {
        this.isSend = false;
        this.hasErrors = false;

        this.modalService.toggle({
            show: false,
            id: 'serviceAddToServicegroupModal'
        });
    }

    public ngOnChanges() {
        this.joinedServiceIds = this.items.map(item => item.key).join(',');
    }

}
