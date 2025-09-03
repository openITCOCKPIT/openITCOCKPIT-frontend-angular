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

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { PermissionsService } from '../../../permissions/permissions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IndexPage } from '../../../pages.interface';
import { StatuspagegroupsService } from '../statuspagegroups.service';
import { ModalService } from '@coreui/angular';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';

import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { NotyService } from '../../../layouts/coreui/noty.service';
import {
    getStatuspagegroupsIndexParams,
    Statuspagegroup,
    StatuspagegroupsIndex,
    StatuspagegroupsIndexParams
} from '../statuspagegroups.interface';


@Component({
    selector: 'oitc-statuspagegroups-index',
    imports: [
        FormsModule,
        PaginatorModule
    ],
    templateUrl: './statuspagegroups-index.component.html',
    styleUrl: './statuspagegroups-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: StatuspagegroupsService}
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagegroupsIndexComponent implements OnInit, OnDestroy, IndexPage {
    public hideFilter: boolean = true;
    public statuspagegroups!: StatuspagegroupsIndex;
    public params: StatuspagegroupsIndexParams = getStatuspagegroupsIndexParams();
    public is_public: boolean = false;
    public not_public: boolean = false;
    public selectedItems: DeleteAllItem[] = [];
    private subscriptions: Subscription = new Subscription();
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private StatuspagegroupsService: StatuspagegroupsService = inject(StatuspagegroupsService);
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)
    private readonly notyService: NotyService = inject(NotyService);
    public readonly PermissionsService = inject(PermissionsService);
    private readonly modalService = inject(ModalService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.load();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.subscriptions.add(this.StatuspagegroupsService.getStatuspagegroups(this.params).subscribe(data => {
            this.statuspagegroups = data;
            this.cdr.markForCheck();
        }));
    }

    public toggleFilter(): void {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter(): void {
    }

    public onFilterChange(event: Event): void {
        this.params.page = 1;
        this.load();
    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.load();

    }

    public onSortChange(sort: Sort): void {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.load();
        }
    }

    public toggleDeleteAllModal(statuspagegroup?: Statuspagegroup) {
        let items: DeleteAllItem[] = [];

        if (statuspagegroup) {
            // User just want to delete a single command
            items = [{
                id: statuspagegroup.id,
                displayName: statuspagegroup.name
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {

                return {
                    id: item.id,
                    displayName: item.name
                };
            });
        }

        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }

        // Pass selection to the modal
        this.selectedItems = items;

        // open modal
        this.modalService.toggle({
            show: true,
            id: 'deleteAllModal',
        });
    }

    public onMassActionComplete(success: boolean): void {
        if (success) {
            this.load();
        }
    }

}
