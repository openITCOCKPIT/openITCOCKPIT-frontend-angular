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

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SelectionServiceService {


    public currentSelection: any[] = [];
    private selectionSubject = new BehaviorSubject<any[]>([]);
    public selection$ = this.selectionSubject.asObservable();
    private selectAllSubject = new BehaviorSubject<boolean>(false);
    public selectAll$ = this.selectAllSubject.asObservable();

    constructor() {
    }


    public selectAll(): void {
        // Clear current selection
        this.currentSelection = [];

        // Notify all item-select components that they should be checked
        this.selectAllSubject.next(true);
    }

    public deselectAll(): void {
        // Clear current selection
        this.currentSelection = [];

        // Update all subscribers
        this.selectionSubject.next(this.currentSelection);

        this.selectAllSubject.next(false);
    }

    public selectItem(item: any): void {
        this.currentSelection.push(item);

        // Tell all subscribers about the new selection
        this.selectionSubject.next(this.currentSelection);
    }

    public deselectItem(item: any): void {
        // Remove the given item from the current selection
        this.currentSelection = this.currentSelection.filter(obj => obj !== item);

        // Tell all subscribers about the new selection
        this.selectionSubject.next(this.currentSelection);
    }

    public getSelectedItems(): any[] {
        return this.currentSelection;
    }

}
