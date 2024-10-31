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
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import { PermissionsService } from '../../../permissions/permissions.service';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { IndexPage } from '../../../pages.interface';
import { StatuspagesService } from '../statuspages.service';
import {
    StatuspagesIndexRoot,
    getDefaultStatuspagesIndexParams, StatuspagesParams, StatuspageObject,
} from '../statuspages.interface';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownComponent,
    DropdownDividerDirective,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective,
    ModalService,
} from '@coreui/angular';
import { NgForOf, NgIf } from '@angular/common';
import {AsyncPipe} from '@angular/common';
import {XsButtonDirective} from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {PaginatorChangeEvent} from '../../../layouts/coreui/paginator/paginator.interface';
import {MatSort, MatSortHeader, Sort} from '@angular/material/sort';
import {Subscription} from 'rxjs';
import {TableLoaderComponent} from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import {ItemSelectComponent} from '../../../layouts/coreui/select-all/item-select/item-select.component';
import {BadgeOutlineComponent} from '../../../layouts/coreui/badge-outline/badge-outline.component';
import {ActionsButtonComponent} from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import {NoRecordsComponent} from '../../../layouts/coreui/no-records/no-records.component';
import {SelectAllComponent} from '../../../layouts/coreui/select-all/select-all.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import {FormsModule} from '@angular/forms';
import {PaginatorModule} from 'primeng/paginator';
import {DebounceDirective} from '../../../directives/debounce.directive';
import {TrueFalseDirective} from '../../../directives/true-false.directive';
import {DeleteAllItem} from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DisableModalComponent } from '../../../layouts/coreui/disable-modal/disable-modal.component';
import {DELETE_SERVICE_TOKEN} from '../../../tokens/delete-injection.token';


@Component({
  selector: 'oitc-statuspages-index',
  standalone: true,
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        CardComponent,
        AsyncPipe,
        CardHeaderComponent,
        CardTitleDirective,
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        TableLoaderComponent,
        NgIf,
        NgForOf,
        CardBodyComponent,
        MatSort,
        TableDirective,
        MatSortHeader,
        ItemSelectComponent,
        BadgeOutlineComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        DropdownDividerDirective,
        NoRecordsComponent,
        ColComponent,
        ContainerComponent,
        RowComponent,
        SelectAllComponent,
        PaginateOrScrollComponent,
        FormDirective,
        FormsModule,
        PaginatorModule,
        DebounceDirective,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TranslocoPipe,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        TrueFalseDirective,
        DeleteAllModalComponent,
        DisableModalComponent,
    ],
  templateUrl: './statuspages-index.component.html',
  styleUrl: './statuspages-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: StatuspagesService}
    ],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class StatuspagesIndexComponent implements OnInit, OnDestroy, IndexPage {
    public hideFilter: boolean = true;
    public statuspages!: StatuspagesIndexRoot;
    public params: StatuspagesParams = getDefaultStatuspagesIndexParams();
    public is_public: boolean = false;
    public not_public: boolean = false;
    public selectedItems: DeleteAllItem[] = [];
    private subscriptions: Subscription = new Subscription();
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private StatuspagesService: StatuspagesService = inject(StatuspagesService);
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
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
        let public_state = null;
        if(this.is_public !== this.not_public) {
            public_state = this.is_public === true;
        }
        this.params['filter[Statuspages.public]'] = public_state;

        this.subscriptions.add(this.StatuspagesService.getStatuspagesIndex(this.params).subscribe(data => {
            this.statuspages = data;
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

    public toggleDeleteAllModal(statuspage?: StatuspageObject) {
        let items: DeleteAllItem[] = [];

        if (statuspage) {
            // User just want to delete a single command
            items = [{
                id: statuspage.id,
                displayName: statuspage.name
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
