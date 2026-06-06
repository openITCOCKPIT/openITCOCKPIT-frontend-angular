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

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from "@angular/router";


import {
    CardBodyComponent,
    CardComponent,
    CardImgDirective,
    CardTextDirective,
    CardTitleDirective,
    ColComponent,
    RowComponent
} from '@coreui/angular';


import { FaIconComponent } from "@fortawesome/angular-fontawesome";

import { TranslocoDirective } from "@jsverse/transloco";


import { ProgressBarModule } from 'primeng/progressbar';


@Component({
    selector: 'app-start-page',
    imports: [
        RouterModule,
        CardComponent,
        CardBodyComponent,
        CardTitleDirective,
        FaIconComponent,
        TranslocoDirective,
        ProgressBarModule,
        RowComponent,
        ColComponent,
        CardImgDirective,
        CardTextDirective
    ],
    templateUrl: './start-page.component.html',
    styleUrl: './start-page.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartPageComponent {

}
