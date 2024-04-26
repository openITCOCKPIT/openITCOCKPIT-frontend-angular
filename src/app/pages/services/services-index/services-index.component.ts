import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective } from '@jsverse/transloco';
import {FaIconComponent, FaStackComponent, FaStackItemSizeDirective} from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import {ActivatedRoute, Router, RouterLink, RouterModule} from '@angular/router';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { Subscription } from 'rxjs';
import { ServicesIndexService } from './services-index.service';
import { ServicesIndexRoot, ServiceParams } from   "./services.interface"
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent, CardTitleDirective,
    ColComponent, ContainerComponent,
    NavComponent,
    NavItemComponent,
    NavLinkDirective, PopoverDirective,
    RoundedDirective,
    RowComponent,
    TabContentComponent,
    TabContentRefDirective, TableDirective,
    TabPaneComponent,
    TextColorDirective, TooltipDirective
} from '@coreui/angular';
import {XsButtonDirective} from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {CommandIndexRoot} from '../../commands/commands.interface';
import {MatSort, Sort} from '@angular/material/sort';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ItemSelectComponent} from '../../../layouts/coreui/select-all/item-select/item-select.component';
import {NoRecordsComponent} from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import {PaginatorChangeEvent} from '../../../layouts/coreui/paginator/paginator.interface';


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
        XsButtonDirective,
        CardTitleDirective,
        MatSort,
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
    ],
  templateUrl: './services-index.component.html',
  styleUrl: './services-index.component.css'
})
export class ServicesIndexComponent implements OnInit, OnDestroy  {

    private subscriptions: Subscription = new Subscription();
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private ServicesIndexService: ServicesIndexService = inject(ServicesIndexService);
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
    }
    public services?: ServicesIndexRoot;

    ngOnInit() {
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


}
