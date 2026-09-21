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

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from "@coreui/angular";
import { XsButtonDirective } from "../../../layouts/coreui/xsbutton-directive/xsbutton.directive";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { Subscription } from 'rxjs';
import { LdapgroupsService } from '../ldapgroups.service';
import {
    getDefaultLdapgroupsIndexParams,
    LdapgroupObject,
    LdapgroupsIndexParams,
    LdapgroupsIndexRoot
} from '../ldapgroups.interface';
import { AsyncPipe } from '@angular/common';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';

import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { PermissionDirective } from "../../../permissions/permission.directive";

import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { IndexPage } from '../../../pages.interface';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import {
    LdapgroupsAddToUsergroupComponent
} from '../../../components/ldapgroups/ldapgroups-add-to-usergroup/ldapgroups-add-to-usergroup.component';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import {
    LdapgroupsAddToUsercontainerrolesComponent
} from '../../../components/ldapgroups/ldapgroups-add-to-usercontainerroles/ldapgroups-add-to-usercontainerroles.component';

@Component({
    selector: 'oitc-ldapgroups-index',
    imports: [
        TranslocoDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        FaIconComponent,
        PaginateOrScrollComponent,
        TableDirective,
        ContainerComponent,
        RowComponent,
        ColComponent,
        FormDirective,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TranslocoPipe,
        RouterLink,
        FormsModule,
        DebounceDirective,
        PermissionDirective,
        NoRecordsComponent,
        MatCheckboxModule,
        SelectAllComponent,
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        TableLoaderComponent,
        AsyncPipe,
        LdapgroupsAddToUsergroupComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        LdapgroupsAddToUsercontainerrolesComponent
    ],
    templateUrl: './ldapgroups-index.component.html',
    styleUrl: './ldapgroups-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LdapgroupsIndexComponent implements OnInit, OnDestroy, IndexPage {

    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public params: LdapgroupsIndexParams = getDefaultLdapgroupsIndexParams()
    public ldapgroups?: LdapgroupsIndexRoot;
    public hideFilter: boolean = true;
    public selectedItems: any[] = [];
    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    private LdapgroupsService = inject(LdapgroupsService)
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            let id = params['id'];
            if (id) {
                this.params['filter[Ldapgroups.id][]'] = [].concat(id); // make sure we always get an array
                this.cdr.markForCheck();
            }
            this.loadLdapgroups();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadLdapgroups() {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(this.LdapgroupsService.getIndex(this.params)
            .subscribe((result) => {
                this.ldapgroups = result;
                this.cdr.markForCheck();
            })
        );
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultLdapgroupsIndexParams();
        this.loadLdapgroups();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadLdapgroups();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadLdapgroups();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadLdapgroups();
        }
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadLdapgroups();
        }
    }

    protected confirmAddLdapgroupsToUsergroups = (ldapgroup?: LdapgroupObject): void => {
        let items: SelectKeyValue[] = [];

        if (ldapgroup) {
            items = [{
                key: Number(ldapgroup.id),
                value: String(ldapgroup.cn)
            }];
        } else {
            items = this.SelectionServiceService.getSelectedItems().map((item): SelectKeyValue => {
                return {
                    key: item.Ldapgroup.id,
                    value: item.Ldapgroup.cn
                };
            });
        }
        this.selectedItems = items;
        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.modalService.toggle({
            show: true,
            id: 'ldapgroupAddToUsergroupModal',
        });
    }

    protected confirmAddLdapgroupsToUsercontainerroles = (ldapgroup?: LdapgroupObject): void => {
        let items: SelectKeyValue[] = [];

        if (ldapgroup) {
            items = [{
                key: Number(ldapgroup.id),
                value: String(ldapgroup.cn)
            }];
        } else {
            items = this.SelectionServiceService.getSelectedItems().map((item): SelectKeyValue => {
                return {
                    key: item.Ldapgroup.id,
                    value: item.Ldapgroup.cn
                };
            });
        }
        this.selectedItems = items;
        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.modalService.toggle({
            show: true,
            id: 'ldapgroupAddToUsercontainerrolesModal',
        });
    }

}
