import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { Subscription } from 'rxjs';
import { ServicesIndexService } from './services-index.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { ServicesIndexRoot, ServiceParams } from   "./services.interface";
import { ServicestatusIconComponent } from '../../../components/services/servicestatus-icon/servicestatus-icon.component';
import { ServicesIndexFilterComponent } from '../../../components/services/services-index-filter/services-index-filter.component';
import { HoststatusIconComponent} from '../../../components/hosts/hoststatus-icon/hoststatus-icon.component';
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
    NavComponent,
    NavItemComponent,
    TabContentComponent,
    PopoverDirective,
    RowComponent,
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { XsButtonDirective}  from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import {ActionsButtonComponent} from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import {SelectAllComponent} from '../../../layouts/coreui/select-all/select-all.component';
import {DeleteAllItem} from '../../../layouts/coreui/delete-all-modal/delete-all.interface';


@Component({
  selector: 'oitc-services-index',
  standalone: true,
    imports: [
        CoreuiComponent,
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        DebounceDirective,
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
        ServicesIndexFilterComponent
    ],
  templateUrl: './services-index.component.html',
  styleUrl: './services-index.component.css'
})
export class ServicesIndexComponent implements OnInit, OnDestroy  {

    private subscriptions: Subscription = new Subscription();
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private ServicesIndexService: ServicesIndexService = inject(ServicesIndexService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    public params: ServiceParams = {
        'angular': true,
        'scroll': true,
        'sort': 'Servicestatus.current_state',
        'page': 1,
        'direction': 'desc',
        'filter[Hosts.id]': [],
        'filter[Hosts.name]': '',
        'filter[Hosts.name_regex]': false,
        'filter[Hosts.satellite_id][]': [],
        'filter[Services.id][]': [],
        'filter[Services.service_type][]': [],
        'filter[servicename]': '',
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

    ngOnInit() {
            this.load();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    load () {
        this.subscriptions.add(this.ServicesIndexService.getServicesIndex(this.params)
            .subscribe((services) => {
                let random_boolean = Math.random() < 0.5
              /*  services.all_services[0].Servicestatus.isFlapping = random_boolean;
                services.all_services[7].Servicestatus.isFlapping = random_boolean;
                services.all_services[0].Hoststatus.isFlapping = random_boolean; */
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

    }

    public disableServices() {
       let items = this.SelectionServiceService.getSelectedItems().map((item): any => {
            return {
                id: item.Service.id,
                displayName: item.Service.servicename
            };
           //return item;
        });
       console.log(items);
    }



}
