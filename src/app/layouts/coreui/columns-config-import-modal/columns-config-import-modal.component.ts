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

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    Output,
    ViewChild
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import {
    ButtonCloseDirective,
    FormControlDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    RowComponent,
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { XsButtonDirective } from '../xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-columns-config-import-modal',
    imports: [
        TranslocoDirective,
        ModalComponent,
        ButtonCloseDirective,
        ModalHeaderComponent,
        ModalTitleDirective,
        FaIconComponent,
        ModalFooterComponent,
        ModalBodyComponent,
        RowComponent,
        FormsModule,
        NgIf,
        FormControlDirective,
        XsButtonDirective
    ],
    templateUrl: './columns-config-import-modal.component.html',
    styleUrl: './columns-config-import-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnsConfigImportModalComponent {
    public configString: string = '';
    public configArray: boolean[] = []
    public error: boolean = false;
    public errorMessage = 'Column config is not for this table'
    @Input({required: true}) public columnsTableKey: string = '';
    @Output() toImport = new EventEmitter<boolean[]>();
    private readonly modalService = inject(ModalService);
    @ViewChild('modal') private modal!: ModalComponent;
    private cdr = inject(ChangeDetectorRef);

    public hideModal() {
        this.error = false;
        this.configString = '';

        this.cdr.markForCheck();

        this.modalService.toggle({
            show: false,
            id: 'columnsConfigImportModal'
        });
    }

    // Called by (click) - no manual change detection required
    public sendConfig() {
        try {
            var configObject = JSON.parse(this.configString);
            if (configObject.key == this.columnsTableKey && Array.isArray(configObject.value)) {
                this.toImport.emit(configObject.value);
                this.hideModal();
            } else if (configObject.key != this.columnsTableKey) {
                this.error = true
                this.errorMessage = 'Column config is not for this table';
            } else {
                this.error = true;
                this.errorMessage = 'Unable to import config';
            }
        } catch (e) {
            this.error = true;
            this.errorMessage = 'Unable to import config';
        }

    }

}
