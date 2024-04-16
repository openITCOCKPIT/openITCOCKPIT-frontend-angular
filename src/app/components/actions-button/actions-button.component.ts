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

import {booleanAttribute, Component, Input} from '@angular/core';
import {ButtonGroupComponent, DropdownComponent, DropdownMenuDirective, DropdownToggleDirective} from '@coreui/angular';
import {PermissionDirective} from '../../permissions/permission.directive';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import {XsButtonDirective} from '../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
  selector: 'oitc-actions-button',
  standalone: true,
  imports: [
    ButtonGroupComponent,
    DropdownComponent,
    PermissionDirective,
    NgIf,
    FaIconComponent,
    XsButtonDirective,
    DropdownToggleDirective,
    DropdownMenuDirective
  ],
  templateUrl: './actions-button.component.html',
  styleUrl: './actions-button.component.css'
})
export class ActionsButtonComponent {

  protected readonly faCog = faCog;
  @Input({transform: booleanAttribute, required: true}) allow_edit: boolean = true;
  @Input({required: true}) url: string = '';
  @Input({required: true}) permission: string = '';

  constructor(private router: Router) {
  }

  public onClick(): void {
    this.router.navigateByUrl(this.url);
  }

}
