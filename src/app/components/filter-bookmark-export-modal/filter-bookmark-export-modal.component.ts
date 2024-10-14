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

import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import {
    ButtonCloseDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { CopyToClipboardComponent } from '../../layouts/coreui/copy-to-clipboard/copy-to-clipboard.component';
import { XsButtonDirective } from '../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-filter-bookmark-export-modal',
    standalone: true,
    imports: [
        TranslocoDirective,
        ModalComponent,
        ButtonCloseDirective,
        ModalHeaderComponent,
        ModalTitleDirective,
        XsButtonDirective,
        FaIconComponent,
        ModalFooterComponent,
        ModalBodyComponent,
        RowComponent,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        CopyToClipboardComponent,
        FormControlDirective
    ],
    templateUrl: './filter-bookmark-export-modal.component.html',
    styleUrl: './filter-bookmark-export-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterBookmarkExportModalComponent {

    @Input({required: true}) public urlString: string = '';
    private readonly modalService = inject(ModalService);
    @ViewChild('modal') private modal!: ModalComponent;

    public hideModal() {
        this.modalService.toggle({
            show: false,
            id: 'bookmarkExportModal'
        });
    }

}
