import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { LogentriesService } from '../logentries.service';

import { getDefaultLogentriesParams, LogentriesRoot, LogentryIndexParams } from '../logentries.interface';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NgForOf, NgIf } from '@angular/common';


import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';


import { ServerLinkComponent } from '../server-link/server-link.component';

import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { HostsService } from '../../hosts/hosts.service';
import { HostsLoadHostsByStringParams } from '../../hosts/hosts.interface';
import _, { parseInt } from 'lodash';
import { IndexPage } from '../../../pages.interface';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';

@Component({
    selector: 'oitc-logentries-index',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        ColComponent,
        DebounceDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        PaginatorModule,
        RowComponent,
        TranslocoPipe,
        MatSort,
        MatSortHeader,
        NgIf,
        TableDirective,
        NgForOf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        ContainerComponent,
        ServerLinkComponent,
        MultiSelectComponent,
        CardFooterComponent,
        TableLoaderComponent
    ],
    templateUrl: './logentries-index.component.html',
    styleUrl: './logentries-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogentriesIndexComponent implements OnInit, OnDestroy, IndexPage {
    private LogentriesService = inject(LogentriesService)
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public params: LogentryIndexParams = getDefaultLogentriesParams();
    public hosts: SelectKeyValue[] = [];

    public logentries?: LogentriesRoot;
    public hideFilter: boolean = true;
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);


    private readonly HostsService = inject(HostsService);
    public entryTypesForSelect: any[] = [];

    private cdr = inject(ChangeDetectorRef);

    public entryTypes = {
        1: this.TranslocoService.translate('Runtime error'),
        2: this.TranslocoService.translate('Runtime warning'),
        4: this.TranslocoService.translate('Verification error'),
        8: this.TranslocoService.translate('Verification warning'),
        16: this.TranslocoService.translate('Config error'),
        32: this.TranslocoService.translate('Config warning'),
        64: this.TranslocoService.translate('Process info'),
        128: this.TranslocoService.translate('Event handler'),
        512: this.TranslocoService.translate('External command'),
        //514 :this.TranslocoService.translate('External command failed'),
        1024: this.TranslocoService.translate('Host up'),
        2048: this.TranslocoService.translate('Host down'),
        4096: this.TranslocoService.translate('Host unreachable'),
        8192: this.TranslocoService.translate('Service ok'),
        16384: this.TranslocoService.translate('Service unknown'),
        32768: this.TranslocoService.translate('Service warning'),
        65536: this.TranslocoService.translate('Service critical'),
        131072: this.TranslocoService.translate('Passive check'),
        262144: this.TranslocoService.translate('Message'),
        524288: this.TranslocoService.translate('Host notification'),
        1048576: this.TranslocoService.translate('Service notification')
    };

    public ngOnInit(): void {
        this.entryTypesForSelect = this.getEntryTypes();
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            this.loadLogentries();
        }));
        this.loadHosts('');
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public getEntryTypes() {
        let entryTypes = _.map(
            this.entryTypes,
            (value, key) => {
                return {key: parseInt(key), value: value}
            }
        );
        return entryTypes;
    }

    public loadLogentries() {
        this.subscriptions.add(this.LogentriesService.getIndex(this.params)
            .subscribe((result) => {
                this.logentries = result;
                this.cdr.markForCheck();
            })
        );
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultLogentriesParams();
        this.loadLogentries();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadLogentries();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event | null) {
        this.params.page = 1;
        this.loadLogentries();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadLogentries();
        }
    }

    public loadHosts = (searchString: string) => {
        var selected: number[] = [];
        if (this.params['filter[Host.id][]'] !== undefined) {
            selected = this.params['filter[Host.id][]'];
        }

        let params: HostsLoadHostsByStringParams = {
            angular: true,
            'filter[Hosts.name]': searchString,
            'selected[]': selected,
            includeDisabled: false
        }

        this.subscriptions.add(this.HostsService.loadHostsByString(params)
            .subscribe((result) => {
                this.hosts = result;
            })
        );
    }

    protected readonly String = String;

    public onMassActionComplete(success: boolean): void {
    }

}
