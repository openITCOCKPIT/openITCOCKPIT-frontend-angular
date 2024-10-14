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

import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { AsyncPipe, DOCUMENT, JsonPipe, NgIf } from "@angular/common";
import { Subscription } from "rxjs";
import { PermissionDirective } from "../../permissions/permission.directive";
import { CoreuiComponent } from '../../layouts/coreui/coreui.component';
import { faAsterisk, faCircleInfo, faCoffee, faCog, faMouse } from "@fortawesome/free-solid-svg-icons";
import {
    ButtonToolbarComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardSubtitleDirective,
    CardTitleDirective,
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
    NavLinkDirective
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


@Component({
    selector: 'app-start-page',
    standalone: true,
    imports: [
        CoreuiComponent,
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
        CodeMirrorContainerComponent
    ],
    templateUrl: './start-page.component.html',
    styleUrl: './start-page.component.css'
})
export class StartPageComponent implements OnDestroy {
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public readonly routeParams$ = this.route.params;
    public readonly queryParams$ = this.route.queryParams;
    public allowEdit = true;
    protected readonly faCoffee = faCoffee;
    protected readonly faCircleInfo = faCircleInfo;
    protected readonly faAsterisk = faAsterisk;
    protected readonly faCog = faCog;
    protected readonly faMouse = faMouse;
    private readonly subscription = new Subscription();
    private readonly document = inject(DOCUMENT);

    public constructor() {
        this.route.queryParams.subscribe({
            next: console.info,
        });
    }

    public addRandomQueryParam() {
        const key = Math.random();
        const value = Math.random();
        this.router.navigate([], {
            queryParams: {[key]: value},
            queryParamsHandling: "merge",
        })
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    public clickTest() {
        alert("Clicked!!!");
    }

    public switchAllowEdit() {
        this.allowEdit = !this.allowEdit;
    }

}
