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
import { AsyncPipe, JsonPipe, NgClass, NgIf } from "@angular/common";
import { PermissionDirective } from "../../permissions/permission.directive";
import {
    ButtonToolbarComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardImgDirective,
    CardSubtitleDirective,
    CardTextDirective,
    CardTitleDirective,
    ColComponent,
    DropdownDividerDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormTextDirective,
    InputGroupTextDirective,
    ListGroupDirective,
    ListGroupItemDirective,
    NavComponent,
    NavItemComponent,
    NavLinkDirective,
    RowComponent
} from '@coreui/angular';
import { XsButtonDirective } from '../../layouts/coreui/xsbutton-directive/xsbutton.directive';

import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { RequiredIconComponent } from "../../components/required-icon/required-icon.component";
import { TranslocoDirective } from "@jsverse/transloco";
import { ActionsButtonComponent } from '../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../components/actions-button-element/actions-button-element.component';
import { CodeMirrorContainerComponent } from '../../components/code-mirror-container/code-mirror-container.component';
import {
    MessageOfTheDayButtonComponent
} from '../../components/message-of-the-day-button/message-of-the-day-button.component';
import { OitcAlertComponent } from '../../components/alert/alert.component';
import { ProgressBarModule } from 'primeng/progressbar';


@Component({
    selector: 'app-start-page',
    standalone: true,
    imports: [

        RouterModule,
        AsyncPipe,
        JsonPipe,
        NgIf,
        PermissionDirective,
        CardComponent,
        CardHeaderComponent,
        ListGroupDirective,
        ListGroupItemDirective,
        CardBodyComponent,
        CardTitleDirective,
        CardSubtitleDirective,
        CardFooterComponent,
        NavComponent,
        NavItemComponent,
        NavLinkDirective,
        ButtonToolbarComponent,
        XsButtonDirective,
        FormDirective,
        FormLabelDirective,
        FormControlDirective,
        FormTextDirective,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormCheckComponent,
        InputGroupTextDirective,
        FormSelectDirective,
        FaIconComponent,
        RequiredIconComponent,
        TranslocoDirective,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        DropdownDividerDirective,
        CodeMirrorContainerComponent,
        MessageOfTheDayButtonComponent,
        OitcAlertComponent,
        NgClass,
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
