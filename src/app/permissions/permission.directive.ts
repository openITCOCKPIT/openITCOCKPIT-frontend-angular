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

import {
  booleanAttribute,
  Directive,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {PermissionsService} from "./permissions.service";
import {combineLatestWith, filter, map, ReplaySubject, Subscription} from "rxjs";

@Directive({
  selector: '[oitcPermission]',
  standalone: true
})
export class PermissionDirective implements OnInit, OnDestroy {

  private readonly permissionService = inject(PermissionsService);
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);

  private readonly subscription = new Subscription();
  private readonly oitcPermission$$ = new ReplaySubject<string | string[]>();
  private showOnNoPermission: boolean = false;

  @Input({required: true})
  public set oitcPermission(value: string | string[]) {

    this.oitcPermission$$.next(value);
  };

  @Input({transform: booleanAttribute})
  public set oitcPermissionShowOnNoPermission(value: boolean) {

    this.showOnNoPermission = value;
  };

  public ngOnInit() {
    this.subscription.add(this.oitcPermission$$.pipe(
      combineLatestWith(this.permissionService.permissions$),
      map(([oitcPermission, permissions]) => this.permissionService.checkPermission(oitcPermission, permissions)),
      filter(permit => permit),
    ).subscribe({
      next: () => this.viewContainer.createEmbeddedView(this.templateRef),
    }));
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
