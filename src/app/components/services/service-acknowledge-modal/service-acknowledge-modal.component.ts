/*
 * Copyright (C) <2015>  <it-novum GmbH>
 *
 * This file is dual licensed
 *
 * 1.
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, version 3 of the License.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * 2.
 *     If you purchased an openITCOCKPIT Enterprise Edition you can use this file
 *     under the terms of the openITCOCKPIT Enterprise Edition license agreement.
 *     License agreement and license key will be shipped with the order
 *     confirmation.
 */

import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
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
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { ExternalCommandsService, ServiceAcknowledgeItem } from '../../../services/external-commands.service';

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
        FormCheckLabelDirective,
        TranslocoPipe
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
        notify: true,
    };

    hideModal() {
        this.isSend = false;
        this.error = false;

        this.modalService.toggle({
            show: false,
            id: 'serviceAcknowledgeModal'
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

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}
