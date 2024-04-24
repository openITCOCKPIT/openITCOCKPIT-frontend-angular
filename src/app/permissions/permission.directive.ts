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
import { PermissionsService } from "./permissions.service";
import { combineLatestWith, filter, map, ReplaySubject, Subscription } from "rxjs";

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

    private negate: boolean = false;

    /**
     * The user permission as string "commands.index" or string[] ["commands", "index"] to check.
     * The permission gets pushed into the oitcPermission$$ ReplaySubject.
     *
     * The permission check itself is done in the ngOnInit lifecycle hook.
     *
     * @param value
     */
    @Input({required: true})
    public set oitcPermission(value: string | string[]) {
        this.oitcPermission$$.next(value);
    };

    /**
     * The negate attribute is used to negate the permission check.
     * This is useful if you want to show objects (like a message "insufficient permissions") if a user has NOT permissions
     * to see the given action
     *
     * Example usage: <span *oitcPermission="['macros', 'index']; negate: true"></span>
     *
     * @param value
     */
    @Input({transform: booleanAttribute})
    public set oitcPermissionNegate(value: boolean) {
        this.negate = value;
    }

    /**
     * The ngOnInit lifecycle hook is used to check the permission.
     * It subscribes to the oitcPermission$$ ReplaySubject and combines the permission with the current user permissions.
     *
     * Whenever the "map()" operator returns true, the user has permissions to the action and the element will be visible.
     */
    public ngOnInit() {
        this.subscription.add(this.oitcPermission$$.pipe(
            combineLatestWith(this.permissionService.permissions$),
            //tap(([oitcPermission, permissions]) => {
            //    // this tap is only for debugging purposes
            //    console.log(oitcPermission, permissions);
            //    console.log("Negate:", this.negate);
            //    console.log(this.permissionService.checkPermission(oitcPermission, permissions));
            //}),
            map(([oitcPermission, permissions]) => {
                if (Object.keys(permissions).length === 0) {
                    // User permissions are empty for some reasion
                    return false;
                }

                // The permission check itself is done by the PermissionService.

                if (this.negate) {
                    // negate option is set to true
                    // This can be useful if you want to show objects (like a message "insufficient permissions") if a user has NOT permissions
                    return !this.permissionService.checkPermission(oitcPermission, permissions);
                }

                // Normal permission check, if ture you have permissions, if false you don't have permissions
                return this.permissionService.checkPermission(oitcPermission, permissions);
            }),
            filter(permit => permit),
        ).subscribe({
            next: () => this.viewContainer.createEmbeddedView(this.templateRef),
        }));
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
