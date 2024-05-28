import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { Subscription } from 'rxjs';
import { ServicesIndexService } from './services-index.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { filter, Service, ServiceParams, ServicesIndexRoot, TimezoneObject } from "./services.interface";
import { ServicestatusIconComponent } from '../../../components/services/servicestatus-icon/servicestatus-icon.component';
import { ServiceMaintenanceModalComponent} from '../../../components/services/service-maintenance-modal/service-maintenance-modal.component'
import {
    ServicesIndexFilterComponent
} from '../../../components/services/services-index-filter/services-index-filter.component';
import { HoststatusIconComponent } from '../../../components/hosts/hoststatus-icon/hoststatus-icon.component';

import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    PopoverDirective,
    RowComponent,
    TabContentComponent,
    TableDirective,
    TooltipDirective,
} from '@coreui/angular';
import {XsButtonDirective} from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { AckTooltipComponent } from '../../../components/ack-tooltip/ack-tooltip.component';
import { DowntimeTooltipComponent } from '../../../components/downtime-tooltip/downtime-tooltip.component';
import { PopoverGraphComponent } from '../../../components/popover-graph/popover-graph.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { UplotGraphComponent } from '../../../components/uplot-graph/uplot-graph.component';
import { DisableItem } from '../../../layouts/coreui/disable-modal/disable.interface';
import { DisableModalComponent } from '../../../layouts/coreui/disable-modal/disable-modal.component';
import { DISABLE_SERVICE_TOKEN } from '../../../tokens/disable-injection.token';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { NotyService } from '../../../layouts/coreui/noty.service';
import {MaintenanceItem} from '../../../components/services/service-maintenance-modal/service-maintenance.interface';

@Component({
  selector: 'oitc-services-index',
  standalone: true,
    imports: [
        CoreuiComponent,
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        DebounceDirective,
        DisableModalComponent,
        RouterLink,
        RouterModule,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        NavComponent,
        NavItemComponent,
        TabContentComponent,
        XsButtonDirective,
        CardTitleDirective,
        MatSort,
        MatSortHeader,
        TableDirective,
        NgIf,
        NgForOf,
        ItemSelectComponent,
        RowComponent,
        NoRecordsComponent,
        ColComponent,
        ContainerComponent,
        PaginateOrScrollComponent,
        NgClass,
        PopoverDirective,
        TooltipDirective,
        FaStackComponent,
        FaStackItemSizeDirective,
        ServicestatusIconComponent,
        HoststatusIconComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        SelectAllComponent,
        DropdownComponent,
        DropdownItemDirective,
        DropdownToggleDirective,
        DropdownMenuDirective,
        ServicesIndexFilterComponent,
        AckTooltipComponent,
        PopoverGraphComponent,
        DowntimeTooltipComponent,
        UplotGraphComponent,
        DeleteAllModalComponent,
        ServiceMaintenanceModalComponent
    ],
  templateUrl: './services-index.component.html',
  styleUrl: './services-index.component.css',
    providers: [
        {provide: DISABLE_SERVICE_TOKEN, useClass: ServicesIndexService} // Inject the CommandsService into the DeleteAllModalComponent
    ]
})
export class ServicesIndexComponent implements OnInit, OnDestroy  {
    private readonly http = inject(HttpClient);
    private subscriptions: Subscription = new Subscription();
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private ServicesIndexService: ServicesIndexService = inject(ServicesIndexService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly modalService = inject(ModalService);
    public filter: filter = {
        Servicestatus: {
            current_state: [],
            acknowledged: false,
            not_acknowledged: false,
            in_downtime: false,
            not_in_downtime: false,
            passive: false,
            active: false,
            notifications_enabled: false,
            notifications_not_enabled: false,
            output: '',
        },
        Services: {
            id: [],
            name: '',
            name_regex: false,
            keywords:[],
            not_keywords: [],
            servicedescription: '',
            priority: {
                1: false,
                2: false,
                3: false,
                4: false,
                5: false
            },
            service_type: []
        },
        Hosts: {
            id: [],
            name: '',
            name_regex: false,
            satellite_id: []
        }
    };
    public params: ServiceParams = {
        'angular': true,
        'scroll': true,
        'sort': 'Servicestatus.current_state',
        'page': 1,
        'direction': 'desc',
        'filter[Hosts.id]': [],
        'filter[Hosts.name]': '',
        'filter[Hosts.name_regex]': '',
        'filter[Hosts.satellite_id][]': [],
        'filter[Services.id][]': [],
        'filter[Services.service_type][]': [],
        'filter[servicename]': '',
        'filter[servicename_regex]': '',
        'filter[servicedescription]': '',
        'filter[Servicestatus.output]': '',
        'filter[Servicestatus.current_state][]': [],
        'filter[keywords][]': [],
        'filter[not_keywords][]': [],
        'filter[Servicestatus.problem_has_been_acknowledged]': '',
        'filter[Servicestatus.scheduled_downtime_depth]': '',
        'filter[Servicestatus.active_checks_enabled]': '',
        'filter[Servicestatus.notifications_enabled]': '',
        'filter[servicepriority][]': []
    };
    public showFilter: boolean = false;
    public services?: ServicesIndexRoot;
    public tab: number = 0;
    public timezone!: TimezoneObject;
    public selectedItems: any[] = [];


    ngOnInit() {
        this.getUserTimezone();
        this.load();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    load () {
        this.subscriptions.add(this.ServicesIndexService.getServicesIndex(this.params)
            .subscribe((services) => {
                this.services = services;
            })
        );
    }

    public setTab(tab: number){
        this.tab = tab;
    }

    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.load();
        }
    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.load();
    }
    public refresh() {
        this.load();
    }

    public showFilterToggle() {
        this.showFilter = !this.showFilter;
    }

    public linkFor(type: string) {
        let baseUrl: string = '/services/listToPdf.pdf?';
        if(type === 'csv'){
            baseUrl = '/services/listToCsv?';
        }

        let urlParams = {
            'angular': true,
            'sort': this.params['sort'],
            'page': this.params['page'],
            'direction': this.params['direction'],
            'filter[Hosts.id]': this.params['filter[Hosts.id]'],
            'filter[Hosts.name]': this.params['filter[Hosts.name]'],
            'filter[Hosts.name_regex]': this.params['filter[Hosts.name_regex]'],
            'filter[Hosts.satellite_id][]': this.params['filter[Hosts.satellite_id][]'],
            'filter[Services.id][]': this.params['filter[Services.id][]'],
            'filter[Services.service_type][]': this.params['filter[Services.service_type][]'],
            'filter[servicename]': this.params['filter[servicename]'],
            'filter[servicename_regex]': this.params['filter[servicename_regex]'],
            'filter[servicedescription]': this.params['filter[servicedescription]'],
            'filter[Servicestatus.output]': this.params['filter[Servicestatus.output]'],
            'filter[Servicestatus.current_state][]': this.filter.Servicestatus.current_state,
            'filter[keywords][]': this.params['filter[keywords][]'],
            'filter[not_keywords][]': this.params['filter[not_keywords][]'],
            'filter[Servicestatus.problem_has_been_acknowledged]': this.params['filter[Servicestatus.problem_has_been_acknowledged]'],
            'filter[Servicestatus.scheduled_downtime_depth]': this.params['filter[Servicestatus.scheduled_downtime_depth]'],
            'filter[Servicestatus.active_checks_enabled]': this.params['filter[Servicestatus.active_checks_enabled]'],
            'filter[Servicestatus.notifications_enabled]': this.params['filter[Servicestatus.notifications_enabled]'],
            'filter[servicepriority][]': this.params['filter[servicepriority][]']
        };


        let stringParams:HttpParams = new HttpParams();

        stringParams = stringParams.appendAll(urlParams);
        return baseUrl + stringParams.toString();

    }

    public resetChecktime() {
        let commands = [];
        commands = this.SelectionServiceService.getSelectedItems().map((item): any => {
            return {
                command: 'rescheduleService',
                hostUuid: item.Host.uuid,
                serviceUuid: item.Service.uuid,
                satelliteId: item.Host.satelliteId
            };

        });
        if(commands.length === 0){
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.subscriptions.add(this.ServicesIndexService.setExternalCommands(commands).subscribe((result) => {
           if(result.message){
               const title = this.TranslocoService.translate('Reschedule');
               const url = ['services', 'index'];
               this.notyService.genericSuccess(result.message, title, url);
           } else {
               this.notyService.genericError();
           }
        }));
    }

    public disableNotifications() {
        let commands = [];
        commands = this.SelectionServiceService.getSelectedItems().map((item): any => {
            return {
                command: 'submitDisableServiceNotifications',
                hostUuid: item.Host.uuid,
                serviceUuid: item.Service.uuid
            };

        });
        if(commands.length === 0){
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return
        }
        this.subscriptions.add(this.ServicesIndexService.setExternalCommands(commands).subscribe((result) => {
            if(result.message){
                const title = this.TranslocoService.translate('Disable Notifications');

                this.notyService.genericSuccess(result.message, title, [], 7000);
                this.notyService.scrollContentDivToTop();
                this.SelectionServiceService.deselectAll()
            } else {
                this.notyService.genericError();
            }

            setTimeout(()=>{this.load()}, 7000);
        }));
    }

    public enableNotifications() {
        let commands = [];
        commands = this.SelectionServiceService.getSelectedItems().map((item): any => {
            return {
                command: 'submitEnableServiceNotifications',
                hostUuid: item.Host.uuid,
                serviceUuid: item.Service.uuid
            };

        });
        if(commands.length === 0){
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.subscriptions.add(this.ServicesIndexService.setExternalCommands(commands).subscribe((result) => {
            if(result.message){
                const title = this.TranslocoService.translate('enable Notifications');

                this.notyService.genericSuccess(result.message, title, [],7000);
                this.notyService.scrollContentDivToTop();
                this.SelectionServiceService.deselectAll()
            } else {
                this.notyService.genericError();
            }

            setTimeout(()=>{this.load()}, 7000);
        }));
    }

    public toggleDowntimeModal(){
        let items: MaintenanceItem[] = [];
        items = this.SelectionServiceService.getSelectedItems().map((item): MaintenanceItem => {
            return {
                command: 'submitServiceDowntime',
                hostUuid: item.Host.uuid,
                serviceUuid: item.Service.uuid,
                start: '',
                end: '',
                author: '',
                comment: '',
            };
        });

    this.selectedItems = items;
        this.modalService.toggle({
            show: true,
            id: 'serviceMaintenanceModal',
        });
    }

    public toggleDisableModal(service?: Service){
        let items: DisableItem[] = [];

        if (service) {
            // User just want to delete a single command
            items = [{
                id: service.id,
                displayName: service.hostname + '/' + service.servicename
            }];
        } else {
            items = this.SelectionServiceService.getSelectedItems().map((item): DisableItem => {
                return {
                    id: item.Service.id,
                    displayName: item.Service.hostname + '/' + item.Service.servicename
                };
            });
        }
        if(items.length === 0){
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.selectedItems = items;

        this.modalService.toggle({
            show: true,
            id: 'disableModal',
        });
    }

    public onMassActionComplete(success: boolean) {
        if (success) {
            this.load();
        }
    }

    getFilter(filter: filter) {
        this.params['filter[Hosts.name]'] = filter.Hosts.name;
        this.params['filter[Hosts.name_regex]'] = filter.Hosts.name_regex;
        this.params['filter[servicename]'] = filter.Services.name;
        this.params['filter[servicename_regex]'] = filter.Services.name_regex;
        this.params['filter[servicedescription]'] = filter.Services.servicedescription;
        this.params['filter[keywords][]'] = filter.Services.keywords;
        this.params['filter[not_keywords][]'] = filter.Services.not_keywords,
        this.params['filter[Servicestatus.current_state][]'] = filter.Servicestatus.current_state;

        if(filter.Servicestatus.acknowledged !== filter.Servicestatus.not_acknowledged){
            this.params['filter[Servicestatus.problem_has_been_acknowledged]'] = filter.Servicestatus.acknowledged;
        } else {
            this.params['filter[Servicestatus.problem_has_been_acknowledged]'] = '';
        }
        if(filter.Servicestatus.in_downtime !== filter.Servicestatus.not_in_downtime){
            this.params['filter[Servicestatus.scheduled_downtime_depth]'] = filter.Servicestatus.in_downtime;
        } else {
            this.params['filter[Servicestatus.scheduled_downtime_depth]'] = '';
        }

        if(filter.Servicestatus.notifications_enabled !== filter.Servicestatus.notifications_not_enabled){
            this.params['filter[Servicestatus.notifications_enabled]'] = filter.Servicestatus.notifications_enabled;
        } else{
            this.params['filter[Servicestatus.notifications_enabled]'] = '';
        }

        if(filter.Servicestatus.passive !== filter.Servicestatus.active){
            this.params['filter[Servicestatus.active_checks_enabled]'] = !filter.Servicestatus.passive;
        } else {
            this.params['filter[Servicestatus.active_checks_enabled]'] = '';
        }
        var priorityFilter: number[] = [];
        Object.entries(filter.Services.priority).forEach(([key, value]) => {
            if(value){
                priorityFilter.push(parseInt(key));
            }
        });
        this.params['filter[servicepriority][]'] = priorityFilter
        this.filter = filter;
        this.load();

    }

    private getUserTimezone() {
        this.subscriptions.add(this.ServicesIndexService.getUserTimezone()
            .subscribe((timezone) => {
                this.timezone = timezone.timezone;
            })
        );
    }


}
