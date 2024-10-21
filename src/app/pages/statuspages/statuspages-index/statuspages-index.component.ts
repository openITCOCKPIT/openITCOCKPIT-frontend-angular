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
    getDefaultStatuspagesIndexParams, StatuspagesParams,
} from '../statuspages.interface';
import {
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    DropdownComponent,
    DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective, NavComponent, NavItemComponent
} from '@coreui/angular';
import {AsyncPipe} from '@angular/common';
import {XsButtonDirective} from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {PaginatorChangeEvent} from '../../../layouts/coreui/paginator/paginator.interface';
import {Sort} from '@angular/material/sort';
import {Subscription} from 'rxjs';
import {
    getDefaultInstantreportsIndexParams,
    InstantreportsIndexParams
} from '../../instantreports/instantreports.interface';


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
        XsButtonDirective
    ],
  templateUrl: './statuspages-index.component.html',
  styleUrl: './statuspages-index.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagesIndexComponent implements OnInit, OnDestroy, IndexPage {
    public hideFilter: boolean = true;
    public statuspages!: StatuspagesIndexRoot;
    public params: StatuspagesParams = getDefaultStatuspagesIndexParams();
    private subscriptions: Subscription = new Subscription();
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private StauspagesService: StatuspagesService = inject(StatuspagesService);
    public readonly PermissionsService = inject(PermissionsService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public toggleFilter(): void {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter(): void {
    }

    public onFilterChange(event: Event): void {
        this.params.page = 1;
    }
    public onPaginatorChange(change: PaginatorChangeEvent): void {

    }

    public onSortChange(sort: Sort): void {

    }
    public onMassActionComplete(success: boolean): void {
    }

}
