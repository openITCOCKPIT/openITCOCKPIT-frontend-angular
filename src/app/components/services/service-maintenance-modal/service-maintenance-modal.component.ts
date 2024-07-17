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

import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {
    ButtonCloseDirective,
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
    RowComponent,
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NotyService } from '../../../layouts/coreui/noty.service';
import {
    DowntimesDefaultsService,
    ValidateInput,
    ValidationErrors
} from '../../../services/downtimes-defaults.service';
import { ExternalCommandsService, ServiceDowntimeItem } from '../../../services/external-commands.service';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';


@Component({
    selector: 'oitc-service-maintenance-modal',
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
        XsButtonDirective
    ],
    templateUrl: './service-maintenance-modal.component.html',
    styleUrl: './service-maintenance-modal.component.css'
})
export class ServiceMaintenanceModalComponent implements OnInit, OnDestroy {
    @Input({required: true}) public items: ServiceDowntimeItem[] = [];
    @Input({required: false}) public maintenanceMessage: string = '';
    @Input({required: false}) public helpMessage: string = '';
    @Output() completed = new EventEmitter<boolean>();
    public hasErrors: boolean = false;
    public errors?: ValidationErrors;
    public error: boolean = false;
    public isSend: boolean = false;
    public state?: any
    public downtimeModal = {
        comment: '',
        from_date: '',
        from_time: '',
        to_date: '',
        to_time: ''
    };

    private readonly TranslocoService = inject(TranslocoService);
    private readonly DowntimesDefaultsService = inject(DowntimesDefaultsService);
    private readonly ExternalCommandsService = inject(ExternalCommandsService);
    private readonly modalService = inject(ModalService);
    private readonly notyService = inject(NotyService);

    private subscriptions: Subscription = new Subscription();
    @ViewChild('modal') private modal!: ModalComponent;

    hideModal() {
        this.isSend = false;
        this.hasErrors = false;
        this.errors = {};

        this.modalService.toggle({
            show: false,
            id: 'serviceMaintenanceModal'
        });
    }

    setExternalCommands() {
        this.error = false;
        this.isSend = true;
        const validate: ValidateInput = {
            comment: this.downtimeModal.comment,
            from_date: this.downtimeModal.from_date,
            from_time: this.downtimeModal.from_time,
            to_date: this.downtimeModal.to_date,
            to_time: this.downtimeModal.to_time
        }
        this.isSend = true;
        this.subscriptions.add(this.DowntimesDefaultsService.validateDowntimesInput(validate).subscribe((result: any) => {

            if (!result.success) {
                this.errors = result.data.Downtime;
                this.isSend = false;
            }
            if (result.success) {
                const start = result.data.js_start;
                const end = result.data.js_end;
                this.items.forEach((element: ServiceDowntimeItem) => {
                    element.start = start;
                    element.end = end;
                    element.comment = this.downtimeModal.comment;
                });
                this.sendCommands();
            }
        }));
    }


    ngOnInit() {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            if (state.id === 'serviceMaintenanceModal' && state.show === true) {
                this.getDefaults();
            }
        }));
        this.downtimeModal.comment = this.TranslocoService.translate('In progress');
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    getDefaults() {
        this.subscriptions.add(this.DowntimesDefaultsService.getDowntimesDefaultsConfiguration().subscribe(downtimeDefaults => {
            this.downtimeModal.from_date = this.createDateString(downtimeDefaults.js_from);
            this.downtimeModal.from_time = downtimeDefaults.from_time;
            this.downtimeModal.to_date = this.createDateString(downtimeDefaults.js_to);
            this.downtimeModal.to_time = downtimeDefaults.to_time;
            this.downtimeModal.comment = this.TranslocoService.translate(downtimeDefaults.comment);
        }));
    }


    createDateString = function (jsStringData: string) {
        let splitData = jsStringData.split(',');
        return splitData[0].trim() + '-' + splitData[1].trim() + '-' + splitData[2].trim()
    }

    sendCommands() {
        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(this.items).subscribe((result: {
            message: any;
        }) => {
            //result.message: /nagios_module//cmdController line 256
            if (result.message) {
                const title = this.TranslocoService.translate('Downtimes added');
                const msg = this.TranslocoService.translate('Commands added successfully to queue');

                this.notyService.genericSuccess(msg, title);
                this.hideModal();
                setTimeout(() => {
                    this.completed.emit(true);
                }, 3500);

            } else {
                this.notyService.genericError();
                this.hideModal();
            }
        }));
    }
}
