import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { SlasService } from '../Slas.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import {
    getDefaultSlasViewDetailsParams,
    LoadContainersRoot,
    SlasViewDetailsParams,
    SlasViewDetailsRoot
} from '../Slas.interface';
import {
  BadgeComponent,
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
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';

import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AsyncPipe, KeyValuePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';

import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { WeekDays } from '../../../components/timeperiod-details-tooltip/timeperiod-details-tooltip.interface';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { BadgeOutlineComponent } from '../../../../../layouts/coreui/badge-outline/badge-outline.component';
import {
    SlaAvailabilityOverviewPieEchartComponent
} from '../../../components/charts/sla-availability-overview-pie-echart/sla-availability-overview-pie-echart.component';
import {
    SlaHostsOverviewBarEchartComponent
} from '../../../components/charts/sla-hosts-overview-bar-echart/sla-hosts-overview-bar-echart.component';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'oitc-slas-view-details',
    imports: [
    ActionsButtonComponent,
    ActionsButtonElementComponent,
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DebounceDirective,
    FaIconComponent,
    FormControlDirective,
    FormDirective,
    FormsModule,
    InputGroupComponent,
    InputGroupTextDirective,
    MatSort,
    MatSortHeader,
    NavComponent,
    NavItemComponent,
    NgForOf,
    NgIf,
    NoRecordsComponent,
    PaginateOrScrollComponent,
    PermissionDirective,
    ReactiveFormsModule,
    RowComponent,
    TableDirective,
    TableLoaderComponent,
    TranslocoDirective,
    TranslocoPipe,
    XsButtonDirective,
    RouterLink,
    NgClass,
    FaStackComponent,
    FaStackItemSizeDirective,
    MultiSelectComponent,
    BackButtonDirective,
    AsyncPipe,
    BadgeOutlineComponent,
    KeyValuePipe,
    SlaAvailabilityOverviewPieEchartComponent,
    SlaHostsOverviewBarEchartComponent,
    SkeletonModule
],
    templateUrl: './slas-view-details.component.html',
    styleUrl: './slas-view-details.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlasViewDetailsComponent implements OnInit, OnDestroy {

    private readonly TranslocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);

    private readonly SlasService: SlasService = inject(SlasService);
    private subscriptions: Subscription = new Subscription();

    public readonly route = inject(ActivatedRoute);
    public hideFilter: boolean = true;
    protected slaId: number = 0;
    protected containers: SelectKeyValue[] = [];
    public weekDays: WeekDays = {} as WeekDays;
    public isLoading: boolean = true;

    public determined_availability = {
        from: null,
        to: null
    };

    public details: SlasViewDetailsRoot = {} as SlasViewDetailsRoot;
    public params: SlasViewDetailsParams = getDefaultSlasViewDetailsParams();
    private cdr = inject(ChangeDetectorRef);

    protected weekdayNames: { id: number, name: string }[] = [
        {id: 1, name: this.TranslocoService.translate('Monday')},
        {id: 2, name: this.TranslocoService.translate('Tuesday')},
        {id: 3, name: this.TranslocoService.translate('Wednesday')},
        {id: 4, name: this.TranslocoService.translate('Thursday')},
        {id: 5, name: this.TranslocoService.translate('Friday')},
        {id: 6, name: this.TranslocoService.translate('Saturday')},
        {id: 7, name: this.TranslocoService.translate('Sunday')}
    ];

    public ngOnInit() {

        this.slaId = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            this.load();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public load() {

        this.isLoading = true;

        this.params['filter[determined_availability][]'] = [this.determined_availability.from ?? 0, this.determined_availability.to ?? 100];
        this.subscriptions.add(this.SlasService.getViewDetails(this.slaId, this.params)
            .subscribe((result: SlasViewDetailsRoot) => {
                this.isLoading = false;
                this.details = result;
                this.weekDays = [];
                for (let i = 0; i <= 6; i++) {
                    // Array required to keep order
                    this.weekDays[i] = [];
                }
                if (this.details.sla.timeperiod.timeperiod_timeranges) {
                    for (let key in this.details.sla.timeperiod.timeperiod_timeranges) {
                        let timeRange = this.details.sla.timeperiod.timeperiod_timeranges[key];
                        // Server day 1 - 7
                        // JavaScript days 0 - 6 to get an array (array has to start with 0!) :(
                        let day = timeRange.day - 1;
                        this.weekDays[day].push({
                            start: timeRange.start,
                            end: timeRange.end
                        });
                    }
                }
                this.cdr.markForCheck();
                this.loadContainers();
            }));

    }

    private loadContainers(): void {
        this.subscriptions.add(this.SlasService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.containers = result.containers;
                this.cdr.markForCheck();
            }))
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultSlasViewDetailsParams();
        this.determined_availability.from = null;
        this.determined_availability.to = null;
        this.load();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.load();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event | null) {
        this.params.page = 1;
        this.load();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.load();
        }
    }

    protected readonly Object = Object;
}
