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

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardSubtitleDirective,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ListGroupDirective,
    ListGroupItemDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    PlaceholderDirective,
    RowComponent,
    TableColorDirective,
    TableDirective
} from "@coreui/angular";
import { XsButtonDirective } from "../../../layouts/coreui/xsbutton-directive/xsbutton.directive";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { Subscription } from 'rxjs';
import { CommandsService } from '../commands.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
    CommandIndex,
    CommandIndexRoot,
    CommandsIndexParams,
    getDefaultCommandsIndexParams
} from '../commands.interface';
import { NgForOf, NgIf } from '@angular/common';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { RequiredIconComponent } from "../../../components/required-icon/required-icon.component";
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { PermissionDirective } from "../../../permissions/permission.directive";
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { CommandTypesEnum } from '../command-types.enum';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';

@Component({
    selector: 'oitc-commands-index',
    standalone: true,
    imports: [
        CoreuiComponent,
        TranslocoDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardSubtitleDirective,
        CardTitleDirective,
        ListGroupDirective,
        ListGroupItemDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        FaIconComponent,
        PaginateOrScrollComponent,
        NgIf,
        TableDirective,
        TableColorDirective,
        ContainerComponent,
        RowComponent,
        ColComponent,
        FormDirective,
        FormControlDirective,
        FormLabelDirective,
        RequiredIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        PlaceholderDirective,
        TranslocoPipe,
        RouterLink,
        FormsModule,
        DebounceDirective,
        NgForOf,
        PermissionDirective,
        TrueFalseDirective,
        NoRecordsComponent,
        MatCheckboxModule,
        SelectAllComponent,
        ItemSelectComponent,
        DeleteAllModalComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        DropdownDividerDirective,
        MatSort,
        MatSortHeader,
    ],
    templateUrl: './commands-index.component.html',
    styleUrl: './commands-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: CommandsService} // Inject the CommandsService into the DeleteAllModalComponent
    ]
})
export class CommandsIndexComponent implements OnInit, OnDestroy {

    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public params: CommandsIndexParams = getDefaultCommandsIndexParams()
    public commands?: CommandIndexRoot;
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];
    public tmpFilter = {
        service_commands: true,
        hostcheck_commands: true,
        notification_commands: true,
        eventhandler_commands: true
    }
    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    private CommandsService = inject(CommandsService)
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);

    constructor(private _liveAnnouncer: LiveAnnouncer) {

    }

    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            let id = params['id'];
            if (id) {
                this.params['filter[Commands.id][]'] = [].concat(id); // make sure we always get an array
            }

            this.loadCommands();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadCommands() {
        this.SelectionServiceService.deselectAll();

        this.params['filter[Commands.command_type][]'] = [];
        if (this.tmpFilter.service_commands) {
            this.params['filter[Commands.command_type][]'].push(CommandTypesEnum.CHECK_COMMAND);
        }
        if (this.tmpFilter.hostcheck_commands) {
            this.params['filter[Commands.command_type][]'].push(CommandTypesEnum.HOSTCHECK_COMMAND);
        }
        if (this.tmpFilter.notification_commands) {
            this.params['filter[Commands.command_type][]'].push(CommandTypesEnum.NOTIFICATION_COMMAND);
        }
        if (this.tmpFilter.eventhandler_commands) {
            this.params['filter[Commands.command_type][]'].push(CommandTypesEnum.EVENTHANDLER_COMMAND);
        }

        this.subscriptions.add(this.CommandsService.getIndex(this.params)
            .subscribe((result) => {
                this.commands = result;
            })
        );
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultCommandsIndexParams();
        this.tmpFilter = {
            service_commands: true,
            hostcheck_commands: true,
            notification_commands: true,
            eventhandler_commands: true
        }
        this.loadCommands();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadCommands();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadCommands();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadCommands();
        }
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(command?: CommandIndex) {
        let items: DeleteAllItem[] = [];

        if (command) {
            // User just want to delete a single command
            items = [{
                id: command.Command.id,
                displayName: command.Command.name
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.Command.id,
                    displayName: item.Command.name
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

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadCommands();
        }
    }

    public navigateCopy() {
        let ids = this.SelectionServiceService.getSelectedItems().map(item => item.Command.id).join(',');
        if (ids) {
            this.router.navigate(['/', 'commands', 'copy', ids]);
        }
    }

}
