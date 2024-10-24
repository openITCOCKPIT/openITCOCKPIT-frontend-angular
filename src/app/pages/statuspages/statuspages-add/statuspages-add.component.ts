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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {PermissionDirective} from '../../../permissions/permission.directive';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective, FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import {BackButtonDirective} from '../../../directives/back-button.directive';
import {XsButtonDirective} from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {RequiredIconComponent} from '../../../components/required-icon/required-icon.component';
import {FormErrorDirective} from '../../../layouts/coreui/form-error.directive';
import {SelectComponent} from '../../../layouts/primeng/select/select/select.component';
import { StatuspagesService } from '../statuspages.service';
import {Subscription} from 'rxjs';
import {SelectKeyValue} from '../../../layouts/primeng/select.interface';

@Component({
  selector: 'oitc-statuspages-add',
  standalone: true,
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        BackButtonDirective,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
        FormLabelDirective,
        RequiredIconComponent,
        FormErrorDirective,
        SelectComponent
    ],
  templateUrl: './statuspages-add.component.html',
  styleUrl: './statuspages-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagesAddComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription = new Subscription();
    private StatuspagesService: StatuspagesService = inject(StatuspagesService);
    private cdr = inject(ChangeDetectorRef);
    public containers: SelectKeyValue[] | undefined;

    public ngOnInit(): void {
            //Fire on page load
            this.loadContainers();
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadContainers() {
        this.subscriptions.add(this.StatuspagesService.loadContainers()
            .subscribe((result) => {
                this.containers = result;
                this.cdr.markForCheck();
            })
        );
    }


}
