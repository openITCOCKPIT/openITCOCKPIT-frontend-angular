import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownComponent,
    DropdownDividerDirective,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { Subscription } from 'rxjs';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import {
    getDefaultHostsIndexFilter,
    getDefaultHostsIndexParams,
    getHostCurrentStateForApi,
    HostObject,
    HostsCurrentStateFilter,
    HostsIndexFilter,
    HostsIndexParams,
    HostsIndexRoot
} from '../hosts.interface';
import { HostsService } from '../hosts.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import {
    QueryHandlerCheckerComponent
} from '../../../layouts/coreui/query-handler-checker/query-handler-checker.component';
import { HoststatusIconComponent } from '../hoststatus-icon/hoststatus-icon.component';
import { PermissionsService } from '../../../permissions/permissions.service';
import {
    AcknowledgementIconComponent
} from '../../acknowledgements/acknowledgement-icon/acknowledgement-icon.component';
import { DowntimeIconComponent } from '../../downtimes/downtime-icon/downtime-icon.component';
import { CopyToClipboardComponent } from '../../../layouts/coreui/copy-to-clipboard/copy-to-clipboard.component';
import { TrustAsHtmlPipe } from '../../../pipes/trust-as-html.pipe';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import {
    RegexHelperTooltipComponent
} from '../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { HttpParams } from '@angular/common/http';
import {
    ServiceResetChecktimeModalComponent
} from '../../../components/services/service-reset-checktime-modal/service-reset-checktime-modal.component';
import {
    HostDisableNotificationsItem,
    HostDowntimeItem,
    HostEnableNotificationsItem,
    HostRescheduleItem,
    ServiceDowntimeItem
} from '../../../services/external-commands.service';
import {
    HostsMaintenanceModalComponent
} from '../../../components/hosts/hosts-maintenance-modal/hosts-maintenance-modal.component';
import { NotyService } from '../../../layouts/coreui/noty.service';
import {
    HostsEnableNotificationsModalComponent
} from '../../../components/hosts/hosts-enable-notifications-modal/hosts-enable-notifications-modal.component';
import {
    HostsDisableNotificationsModalComponent
} from '../../../components/hosts/hosts-disable-notifications-modal/hosts-disable-notifications-modal.component';

@Component({
    selector: 'oitc-hosts-index',
    standalone: true,
    imports: [
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        CoreuiComponent,
        DebounceDirective,
        DeleteAllModalComponent,
        DropdownDividerDirective,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PaginatorModule,
        PermissionDirective,
        RowComponent,
        SelectAllComponent,
        TableDirective,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        NgClass,
        QueryHandlerCheckerComponent,
        TooltipDirective,
        HoststatusIconComponent,
        AcknowledgementIconComponent,
        DowntimeIconComponent,
        FaStackComponent,
        FaStackItemSizeDirective,
        CopyToClipboardComponent,
        TrustAsHtmlPipe,
        FormErrorDirective,
        NgSelectModule,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        TrueFalseDirective,
        RegexHelperTooltipComponent,
        TableLoaderComponent,
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        ServiceResetChecktimeModalComponent,
        HostsMaintenanceModalComponent,
        HostsEnableNotificationsModalComponent,
        HostsDisableNotificationsModalComponent
    ],
    templateUrl: './hosts-index.component.html',
    styleUrl: './hosts-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: HostsService} // Inject the ServicesService into the DeleteAllModalComponent
    ]
})
export class HostsIndexComponent implements OnInit, OnDestroy {
    // Filter vars
    public params: HostsIndexParams = getDefaultHostsIndexParams();
    public filter: HostsIndexFilter = getDefaultHostsIndexFilter();
    public currentStateFilter: HostsCurrentStateFilter = {
        up: false,
        down: false,
        unreachable: false
    };
    public state_typesFilter = {
        soft: false,
        hard: false
    };
    public acknowledgementsFilter = {
        acknowledged: false,
        not_acknowledged: false
    };
    public downtimeFilter = {
        in_downtime: false,
        not_in_downtime: false
    };
    public notificationsFilter = {
        enabled: false,
        not_enabled: false
    };
    public priorityFilter: { [key: string]: boolean } = {
        '1': false,
        '2': false,
        '3': false,
        '4': false,
        '5': false
    };

    // Filter end

    public hosts?: HostsIndexRoot;
    public hideFilter: boolean = true;
    public satellites: SelectKeyValue[] = [];

    public hostTypes: any[] = [];
    public selectedItems: any[] = [];

    private readonly HostsService = inject(HostsService);
    private subscriptions: Subscription = new Subscription();
    public readonly PermissionsService = inject(PermissionsService);
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)
    private readonly notyService: NotyService = inject(NotyService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly modalService = inject(ModalService);


    public ngOnInit() {
        this.hostTypes = this.HostsService.getHostTypes();
        this.loadHosts();

        this.subscriptions.add(this.HostsService.getSatellites()
            .subscribe((result) => {
                this.satellites = result;
            })
        );
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadHosts() {
        this.SelectionServiceService.deselectAll();

        let hasBeenAcknowledged = '';
        let inDowntime = '';
        let notificationsEnabled = '';
        if (this.acknowledgementsFilter.acknowledged !== this.acknowledgementsFilter.not_acknowledged) {
            hasBeenAcknowledged = String(this.acknowledgementsFilter.acknowledged === true);
        }
        if (this.downtimeFilter.in_downtime !== this.downtimeFilter.not_in_downtime) {
            inDowntime = String(this.downtimeFilter.in_downtime === true);
        }
        if (this.notificationsFilter.enabled !== this.notificationsFilter.not_enabled) {
            notificationsEnabled = String(this.notificationsFilter.enabled === true);
        }
        let priorityFilter = [];
        for (var key in this.priorityFilter) {
            if (this.priorityFilter[key] === true) {
                priorityFilter.push(key);
            }
        }
        let state_type: string = '';
        if (this.state_typesFilter.soft !== this.state_typesFilter.hard) {
            state_type = '0';
            if (this.state_typesFilter.hard) {
                state_type = '1';
            }
        }

        if (this.route.snapshot.queryParams.hasOwnProperty('filter.Hosts.id')) {
            this.filter['Hosts.id'] = this.route.snapshot.queryParams['filter.Hosts.id'];
        }
        this.filter['Hoststatus.problem_has_been_acknowledged'] = hasBeenAcknowledged;
        this.filter['Hoststatus.scheduled_downtime_depth'] = inDowntime;
        this.filter['Hoststatus.notifications_enabled'] = notificationsEnabled;
        this.filter['hostpriority'] = priorityFilter;
        this.filter['Hoststatus.is_hardstate'] = state_type;
        this.filter['Hoststatus.current_state'] = getHostCurrentStateForApi(this.currentStateFilter);

        this.subscriptions.add(this.HostsService.getIndex(this.params, this.filter)
            .subscribe((result) => {
                this.hosts = result;
            })
        );
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public problemsOnly() {
        this.resetFilter();

        this.currentStateFilter = {
            up: false,
            down: true,
            unreachable: true
        };
        this.acknowledgementsFilter = {
            acknowledged: false,
            not_acknowledged: true
        };
        this.downtimeFilter = {
            in_downtime: false,
            not_in_downtime: true
        };
    }

    // Callback when a filter has changed
    public onFilterChange(event: any) {
        this.params.page = 1;
        this.loadHosts();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadHosts();
        }
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadHosts();
    }

    public resetFilter() {
        this.params = getDefaultHostsIndexParams();
        this.filter = getDefaultHostsIndexFilter();
        this.currentStateFilter = {
            up: false,
            down: false,
            unreachable: false
        };
        this.state_typesFilter = {
            soft: false,
            hard: false
        };
        this.acknowledgementsFilter = {
            acknowledged: false,
            not_acknowledged: false
        };
        this.downtimeFilter = {
            in_downtime: false,
            not_in_downtime: false
        };
        this.notificationsFilter = {
            enabled: false,
            not_enabled: false
        };
        this.priorityFilter = {
            '1': false,
            '2': false,
            '3': false,
            '4': false,
            '5': false
        };
        this.loadHosts();
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(host?: HostObject) {
        let items: DeleteAllItem[] = [];

        if (host) {
            // User just want to delete a single command
            items = [{
                id: Number(host.id),
                displayName: String(host.hostname)
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.Host.id,
                    displayName: item.Host.hostname
                };
            });
        }


        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
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
            this.loadHosts();
        }
    }

    public navigateCopy() {
        let ids = this.SelectionServiceService.getSelectedItems().map(item => item.Host.id).join(',');
        if (ids) {
            this.router.navigate(['/', 'hosts', 'copy', ids]);
        }
    }

    public linkFor(format: 'pdf' | 'csv') {
        let baseUrl = '/hosts/listToPdf.pdf?';
        if (format === 'csv') {
            baseUrl = '/hosts/listToCsv?';
        }

        let hasBeenAcknowledged = '';
        let inDowntime = '';
        let notificationsEnabled = '';
        if (this.acknowledgementsFilter.acknowledged !== this.acknowledgementsFilter.not_acknowledged) {
            hasBeenAcknowledged = String(this.acknowledgementsFilter.acknowledged === true);
        }
        if (this.downtimeFilter.in_downtime !== this.downtimeFilter.not_in_downtime) {
            inDowntime = String(this.downtimeFilter.in_downtime === true);
        }
        if (this.notificationsFilter.enabled !== this.notificationsFilter.not_enabled) {
            notificationsEnabled = String(this.notificationsFilter.enabled === true);
        }
        let priorityFilter = [];
        for (var key in this.priorityFilter) {
            if (this.priorityFilter[key] === true) {
                priorityFilter.push(key);
            }
        }
        let state_type: string = '';
        if (this.state_typesFilter.soft !== this.state_typesFilter.hard) {
            state_type = '0';
            if (this.state_typesFilter.hard) {
                state_type = '1';
            }
        }

        let urlParams = {
            'angular': true,
            'sort': this.params.sort,
            'page': this.params.page,
            'direction': this.params.direction,
            'filter[Hosts.name]': this.filter['Hosts.name'],
            'filter[Hosts.description]': this.filter.hostdescription,
            'filter[Hoststatus.output]': this.filter['Hoststatus.output'],
            'filter[Hoststatus.current_state][]': getHostCurrentStateForApi(this.currentStateFilter),
            'filter[Hosts.keywords][]': this.filter['Hosts.keywords'],
            'filter[Hosts.not_keywords][]': this.filter['Hosts.not_keywords'],
            'filter[Hoststatus.problem_has_been_acknowledged]': hasBeenAcknowledged,
            'filter[Hoststatus.scheduled_downtime_depth]': inDowntime,
            'filter[Hoststatus.is_hardstate]': state_type,
            'filter[Hosts.address]': this.filter['Hosts.address'],
            'filter[Hosts.satellite_id][]': this.filter['Hosts.satellite_id'],
            'filter[Hosts.host_type][]': this.filter['Hosts.host_type'],
            'filter[hostpriority][]': priorityFilter
        };

        let stringParams: HttpParams = new HttpParams();
        stringParams = stringParams.appendAll(urlParams);
        return baseUrl + stringParams.toString();
    }

    public toggleDisableModal() {
        console.log("Todo implement me");
    }

    public resetChecktime() {
        this.selectedItems = [];
        let selectedHostIds: number[] = this.SelectionServiceService.getSelectedItems().map((item) => item.Host.id);

        this.hosts?.all_hosts.forEach((item) => {
            if (typeof (item.Host.id) === "undefined" || typeof (item.Host.uuid) === "undefined") {
                return;
            }
            if (!selectedHostIds.includes(item.Host.id)) {
                return;
            }

            this.selectedItems.push({
                command: 'rescheduleHost',
                hostUuid: item.Host.uuid,
                type: 'hostOnly',
                satelliteId: 0
            });
        });

        if (this.selectedItems.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.modalService.toggle({
            show: true,
            id: 'serviceResetChecktimeModal'
        });
    }

    public disableNotifications() {
        let items: HostDisableNotificationsItem[] = [];
        this.selectedItems = [];
        let selectedHostIds: number[] = this.SelectionServiceService.getSelectedItems().map((item) => item.Host.id);

        this.hosts?.all_hosts.forEach((item) => {
            if (typeof (item.Host.id) === "undefined" || typeof (item.Host.uuid) === "undefined") {
                return;
            }
            if (!selectedHostIds.includes(item.Host.id)) {
                return;
            }

            items.push({
                command: 'submitDisableHostNotifications',
                hostUuid: item.Host.uuid,
                type: 'hostOnly',
            });
        });
        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }

        this.selectedItems = items;
        this.modalService.toggle({
            show: true,
            id: 'hostDisableNotificationsModal',
        });
    }

    public enableNotifications() {
        let items: HostEnableNotificationsItem[] = [];
        this.selectedItems = [];
        let selectedHostIds: number[] = this.SelectionServiceService.getSelectedItems().map((item) => item.Host.id);

        this.hosts?.all_hosts.forEach((item) => {
            if (typeof (item.Host.id) === "undefined" || typeof (item.Host.uuid) === "undefined") {
                return;
            }
            if (!selectedHostIds.includes(item.Host.id)) {
                return;
            }

            items.push({
                command: 'submitEnableHostNotifications',
                hostUuid: item.Host.uuid,
                type: 'hostOnly',
            });
        });

        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.selectedItems = items;
        this.modalService.toggle({
            show: true,
            id: 'hostEnableNotificationsModal',
        });
    }

    public toggleDowntimeModal() {
        let items: HostDowntimeItem[] = [];
        items = this.SelectionServiceService.getSelectedItems().map((item): HostDowntimeItem => {
            return {
                command: 'submitHostDowntime',
                hostUuid: item.Host.uuid,
                start: 0,
                end: 0,
                author: 'ASNAEB',
                comment: '',
                downtimetype: ''
            };
        });

        this.selectedItems = items;
        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.modalService.toggle({
            show: true,
            id: 'hostMaintenanceModal',
        });
    }

    public acknowledgeStatus() {
        console.log("Todo implement me");
    }

    protected readonly String = String;
}
