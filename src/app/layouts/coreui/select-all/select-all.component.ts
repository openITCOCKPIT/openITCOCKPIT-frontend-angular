/*
 * Copyright (C) <2015-present>  <it-novum GmbH>
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

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    ColComponent,
    ContainerComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    RowComponent
} from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { SelectionServiceService } from './selection-service.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'oitc-select-all',
    standalone: true,
    imports: [
        ColComponent,
        ContainerComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        RowComponent,
        TranslocoDirective,
        FormsModule
    ],
    templateUrl: './select-all.component.html',
    styleUrl: './select-all.component.css'
})
export class SelectAllComponent implements OnInit, OnDestroy {

    @Input() public itemsCount: number = 0;

    public currentSelection: any[] = [];
    public checked = false;
    public intermediate = false;

    private subscriptions: Subscription = new Subscription();

    constructor(public selection: SelectionServiceService) {
    }

    public ngOnInit() {
        // Subscribe to selection changes
        this.subscriptions.add(this.selection.selection$.subscribe(selection => {
            this.currentSelection = selection; // Used to show the length of the selection in the template

            if (selection.length === 0) {
                // 0 items are selected
                // Reset the checked and intermediate state
                this.checked = false;
                this.intermediate = false;
                return;
            }


            if (selection.length === this.itemsCount) {
                // All items are selected
                this.checked = true;
            }

            this.intermediate = false;
            if (selection.length > 0 && selection.length < this.itemsCount) {
                this.intermediate = true;
                this.checked = false;
            }
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public toggleSelectAll() {
        if (this.checked) {
            this.selection.selectAll();
        } else {
            this.selection.deselectAll();
        }
    }

}
