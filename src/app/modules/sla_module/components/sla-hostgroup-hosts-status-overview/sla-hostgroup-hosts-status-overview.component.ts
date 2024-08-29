import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { NgForOf, NgIf, NgStyle } from '@angular/common';

import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { SkeletonModule } from 'primeng/skeleton';
import { SlaHostgroupHostsStatusOverviewService } from './sla-hostgroup-hosts-status-overview.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
    getDefaultSlaHostgroupHostsStatusOverviewParams,
    HeatmapData,
    HostsNotAvailable,
    HostsNotInSla,
    SlaHostgroupHostsStatusOverviewParams,
    SlaHostgroupHostsStatusOverviewRoot,
    SlaStatusOverview
} from './sla-hostgroup-hosts-status-overview.interface';
import { LoadContainersRoot } from '../../../../pages/contactgroups/contactgroups.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../../layouts/coreui/coreui.component';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoRecordsComponent } from '../../../../layouts/coreui/no-records/no-records.component';
import { PermissionDirective } from '../../../../permissions/permission.directive';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { MultiSelectComponent } from '../../../../layouts/primeng/multi-select/multi-select/multi-select.component';

@Component({
    selector: 'oitc-sla-hostgroup-hosts-status-overview',
    standalone: true,
    imports: [
        TranslocoDirective,
        SkeletonModule,
        NgIf,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        CoreuiComponent,
        DebounceDirective,
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NoRecordsComponent,
        PermissionDirective,
        ReactiveFormsModule,
        RowComponent,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        MultiSelectComponent,
        NgStyle
    ],
    templateUrl: './sla-hostgroup-hosts-status-overview.component.html',
    styleUrl: './sla-hostgroup-hosts-status-overview.component.css'
})
export class SlaHostgroupHostsStatusOverviewComponent implements OnInit, OnDestroy, OnChanges {

    @Input() hostgroupId: number = 0;

    private subscriptions: Subscription = new Subscription();
    public readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly SlaHostgroupHostsStatusOverviewService = inject(SlaHostgroupHostsStatusOverviewService);

    public params: SlaHostgroupHostsStatusOverviewParams = getDefaultSlaHostgroupHostsStatusOverviewParams();
    protected containers: SelectKeyValue[] = [];
    public hostsNotAvailable: HostsNotAvailable = {count: 0, ids: []}
    public hostsNotInSla: HostsNotInSla = {count: 0, ids: []}
    public slaStatusOverview: SlaStatusOverview[] = []
    public heatmapData: HeatmapData = {
        rows: 0,
        columns: 0,
        legendLabelFailed: '',
        legendLabelPassed: '',
        legendCsvHeader: ''
    }
    public hideFilter: boolean = true;

    public determined_availability = {
        from: null,
        to: null
    };

    ngOnChanges(changes: SimpleChanges): void {
        //this is necessary to update the component if the hostgroupId was changed
        this.loadSlaHostgroupHostsStatus();
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }


    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            this.loadSlaHostgroupHostsStatus();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public resetFilter() {
        this.params = getDefaultSlaHostgroupHostsStatusOverviewParams();
        this.determined_availability.from = null;
        this.determined_availability.to = null;
        this.loadSlaHostgroupHostsStatus();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event | null) {
        this.loadSlaHostgroupHostsStatus();
    }

    public loadSlaHostgroupHostsStatus() {

        if (this.hostgroupId > 0) {

            this.params['filter[determined_availability][]'] = [this.determined_availability.from ?? 0, this.determined_availability.to ?? 100];

            this.subscriptions.add(this.SlaHostgroupHostsStatusOverviewService.loadSlaHostgroupHostsStatusOverview(this.hostgroupId, this.params)
                .subscribe((result: SlaHostgroupHostsStatusOverviewRoot) => {
                    this.slaStatusOverview = result.slaStatusOverview;
                    this.hostsNotAvailable = result.hostsNotAvailable;
                    this.hostsNotInSla = result.hostsNotInSla;
                    this.heatmapData = result.heatmapData;
                    this.loadContainers();
                }));
        }
    }

    public loadContainers() {
        this.subscriptions.add(this.SlaHostgroupHostsStatusOverviewService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.containers = result.containers;
            }))
    }

    public getBackgroundColorGradient(availabilityDifference: number) {
        let rgbDanger = {
            red: 173, green: 45, blue: 2
        };
        let rgbWarning = {
            red: 255, green: 91, blue: 0
        };

        let rgbSuccessLight = {
            red: 153, green: 204, blue: 51
        };

        let rgbSuccessDark = {
            red: 51, green: 153, blue: 0
        };


        let color1 = rgbDanger;
        let color2 = rgbWarning;
        let fade = availabilityDifference;

        if (availabilityDifference >= 1) {
            fade -= 1;

            color1 = rgbSuccessLight;
            color2 = rgbSuccessDark;
        }

        let diffRed = color2.red - color1.red;
        let diffGreen = color2.green - color1.green;
        let diffBlue = color2.blue - color1.blue;

        let gradient = {
            red: parseInt(Math.floor(color1.red + (diffRed * fade)).toString(), 10),
            green: parseInt(Math.floor(color1.green + (diffGreen * fade)).toString(), 10),
            blue: parseInt(Math.floor(color1.blue + (diffBlue * fade)).toString(), 10)
        };

        return 'rgb(' + gradient.red + ',' + gradient.green + ',' + gradient.blue + ')';

    }

}
