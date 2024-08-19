import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ExternalCommandsService, HostDisableNotificationsItem } from '../../../services/external-commands.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { RequiredIconComponent } from '../../required-icon/required-icon.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { RouterLink } from '@angular/router';


@Component({
    selector: 'oitc-hosts-add-to-hostgroup-modal',
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
    templateUrl: './hosts-add-to-hostgroup.component.html',
    styleUrl: './hosts-add-to-hostgroup.component.css'
})
export class HostsAddToHostgroupComponent implements OnInit, OnDestroy {
    @Input({required: true}) public items: SelectKeyValue[] = [];
    @Input({required: false}) public maintenanceMessage: string = '';
    @Input({required: false}) public helpMessage: string = '';
    @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();
    public hasErrors: boolean = false;
    public isSend: boolean = false;
    public state?: any

    private readonly modalService: ModalService = inject(ModalService);
    private readonly subscriptions: Subscription = new Subscription();

    protected joinedHostIds: string = '5,6,7,8,9';


    public type: string = 'hostOnly';
    @ViewChild('modal') private modal!: ModalComponent;

    public hideModal() {
        this.isSend = false;
        this.hasErrors = false;

        this.modalService.toggle({
            show: false,
            id: 'hostAddToHostgroupModal'
        });
    }

    public ngOnInit() {
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}
