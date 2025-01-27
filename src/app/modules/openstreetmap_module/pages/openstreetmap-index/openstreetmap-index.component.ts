import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
    ViewChild,
    AfterViewInit,
    ElementRef,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent, FormDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
} from '@coreui/angular';
import { TrueFalseDirective } from '../../../../directives/true-false.directive';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import { NgxResizeObserverModule } from 'ngx-resize-observer';
import { OpenstreetmapService } from '../openstreetmap.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PermissionsService } from '../../../../permissions/permissions.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OpenstreetmapToasterService } from './openstreetmap-toaster/openstreetmap-toaster.service';
import { OpenstreetmapToasterComponent } from './openstreetmap-toaster/openstreetmap-toaster.component';
import {
    OpenstreetmapAcls,
    OpenstreetmapSettings,
    OpenstreetmapIndexParams,
    OpenstreetmapIndexRoot,
    OpenstreetmapSettingsFilter,
    FilterTemplate
} from '../openstreetmap.interface';
import * as L from 'leaflet';
import './Hexbinlayer.interface';
import { chain } from 'lodash';
// @ts-ignore
import { hexbinLayer } from './HexbinLayer.js';
import { NgIf, NgFor } from '@angular/common';
import {
    EvcServicestatusToasterComponent
} from '../../../eventcorrelation_module/pages/eventcorrelations/eventcorrelations-view/evc-tree/evc-servicestatus-toaster/evc-servicestatus-toaster.component';

;

@Component({
    selector: 'oitc-openstreetmap-index',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        NavComponent,
        NavItemComponent,
        RowComponent,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        XsButtonDirective,
        ContainerComponent,
        FormDirective,
        FormsModule,
        TranslocoDirective,
        TrueFalseDirective,
        DebounceDirective,
        FormCheckComponent,
        OpenstreetmapToasterComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        NgxResizeObserverModule,
        NgIf,
        NgFor,
        EvcServicestatusToasterComponent,
    ],
    templateUrl: './openstreetmap-index.component.html',
    styleUrl: './openstreetmap-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenstreetmapIndexComponent implements OnInit, OnDestroy, AfterViewInit {

    constructor() {
    }

    @ViewChild('lmap') lmap!: ElementRef<HTMLElement>

    private cdr = inject(ChangeDetectorRef);
    private readonly OpenstreetmapService = inject(OpenstreetmapService);
    public readonly PermissionsService = inject(PermissionsService);
    private readonly OpenstreetmapToasterService = inject(OpenstreetmapToasterService);
    private subscriptions: Subscription = new Subscription();
    public hideFilter: boolean = true;
    public stateFilter: number = 0;
    private includedLocations: number[] = [];
    public map!: L.Map;
    public hexlayer!: L.HexbinLayer;

    public indexParams: OpenstreetmapIndexParams = {
        'angular': true,
        'includedLocationId[]': this.includedLocations,
        'OpenstreetmapSetting[hide_empty_locations]': 0,
        'OpenstreetmapSetting[hide_not_monitored_locations]': 0,
        'OpenstreetmapSetting[state_filter]': 0
    }

    private filterTemplate: FilterTemplate = {
        up_ok: 1,
        warning: 2,
        down_critical: 4,
        unreachable_unknown: 8
    }

    public settingsFilter: OpenstreetmapSettingsFilter = {
        state_filter: null,
        filter: {
            up_ok: 1,
            warning: 2,
            down_critical: 4,
            unreachable_unknown: 8
        },
        hide_empty_locations: null,
        hide_not_monitored_locations: null
    }

    private acls!: OpenstreetmapAcls;
    public settings!: OpenstreetmapSettings;
    public mapData!: OpenstreetmapIndexRoot;
    public server_url: string | null = null;
    public leafletOptions: L.MapOptions = {
        zoom: 6,
        // center: latLng(51.481811, 7.219664),
        center: L.latLng(0, 0)

    };
    public layers: L.Layer[] = [];

    public ngOnInit(): void {

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public ngAfterViewInit(): void {

        this.map = L.map(this.lmap.nativeElement, this.leafletOptions);
        //this.map.setView([51.481811, 7.219664], 13);
        let bounds = this.map.getBounds();
        let zoom = this.map.getZoom();
        let self = this;
        const newCustomControl = L.Control.extend({
            options: {
                position: "topleft"
            },
            onAdd: () => {
                var container = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom");
                container.title = 'Reset Map';
                container.onclick = function () {
                    self.resetMap();
                };
                return container;
            }
        });

        this.map.addControl(new newCustomControl());

        this.loadAclsAndSettings();

    }

    public loadAclsAndSettings(): void {
        this.subscriptions.add(
            this.OpenstreetmapService.getAclAndSettings().subscribe((aclAndSettings) => {
                this.acls = aclAndSettings.acl;
                this.settings = aclAndSettings.settings;
                this.server_url = this.settings.server_url;
                this.settingsFilter.state_filter = Number(this.settings.state_filter);
                this.settingsFilter.hide_empty_locations = Number(this.settings.hide_empty_locations);
                this.settingsFilter.hide_not_monitored_locations = Number(this.settings.hide_not_monitored_locations);
                this.settingsFilter.filter.up_ok = this.settingsFilter.state_filter & this.filterTemplate.up_ok;
                this.settingsFilter.filter.warning = this.settingsFilter.state_filter & this.filterTemplate.warning;
                this.settingsFilter.filter.down_critical = this.settingsFilter.state_filter & this.filterTemplate.down_critical;
                this.settingsFilter.filter.unreachable_unknown = this.settingsFilter.state_filter & this.filterTemplate.unreachable_unknown;
                this.loadMapData(false);
                //this.cdr.markForCheck();
            })
        );
    }

    public loadMapData(includedLocations: boolean): void {
        this.indexParams['OpenstreetmapSetting[hide_empty_locations]'] = this.settingsFilter.hide_empty_locations;
        this.indexParams['OpenstreetmapSetting[hide_not_monitored_locations]'] = this.settings.hide_not_monitored_locations;
        this.indexParams['OpenstreetmapSetting[state_filter]'] = this.settingsFilter.state_filter;
        this.subscriptions.add(
            this.OpenstreetmapService.getIndex(this.indexParams).subscribe((mapData) => {
                this.mapData = mapData;
                this.buildLayers();
                this.cdr.markForCheck();
            })
        );
    }

    public buildLayers(): void {
        if (!this.server_url) {
            return;
        }
        L.tileLayer(this.settings.server_url, {
            maxZoom: 19,
            attribution: "&copy; <a target='_blank' href='http://openstreetmap.org/copyright'>OpenStreetMap</a> contributors | <a target='_blank' href='https://it-novum.com'>it-novum.com</a>",
            noWrap: false
        }).addTo(this.map);
        let cells = chain(this.mapData.locations).groupBy(function (location) {
            return location.container.id;
        }).map(function (values) {
            return {
                latitude: Number(values[0].latitude),
                longitude: Number(values[0].longitude),
                id: values[0].container.id,
                name: values[0].container.name,
                colorcode: values[0].colorcode
            };
        }).value();

        this.hexlayer = hexbinLayer({click: (pointData: any) => this.hexClick(pointData)}).data(cells);
        this.hexlayer.addTo(this.map);

        // @ts-ignore
        this.map.fitBounds(new L.LatLngBounds(this.mapData.locationPoints));
    }

    public hexClick(pointData: any) {
        let containderIds: number[] = [];
        pointData.map((point: any) => {
            containderIds.push(point.o.id);
        });
       // console.log(containderIds);
        //console.log(this.acls);
        //this.OpenstreetmapToasterService.setAclsToaster(this.acls);
        this.OpenstreetmapToasterService.setToasterProperties(containderIds, this.acls);
    }

    public resetMap(): void {
        this.buildLayers();
        //this.loadMapData(false);
    }

    public refresh() {
        this.loadMapData(false);
    }

    public onFilterChange(event: Event) {
        this.settingsFilter.state_filter = this.settingsFilter.filter.up_ok |
            this.settingsFilter.filter.warning |
            this.settingsFilter.filter.down_critical |
            this.settingsFilter.filter.unreachable_unknown;
        this.loadMapData(false);

    }

    public resetFilter(): void {
        this.initFilter();
        this.loadAclsAndSettings();
        this.cdr.markForCheck();
    }


    private initFilter() {
        this.settingsFilter = {
            state_filter: null,
            filter: {
                up_ok: 1,
                warning: 2,
                down_critical: 4,
                unreachable_unknown: 8
            },
            hide_empty_locations: null,
            hide_not_monitored_locations: null
        };
    }

    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public problemsOnly() {

        this.settingsFilter.state_filter = this.settingsFilter.filter.warning |
            this.settingsFilter.filter.down_critical |
            this.settingsFilter.filter.unreachable_unknown;
        this.settingsFilter.filter.up_ok = this.settingsFilter.state_filter & this.filterTemplate.up_ok;
        this.settingsFilter.filter.warning = this.settingsFilter.state_filter & this.filterTemplate.warning;
        this.settingsFilter.filter.down_critical = this.settingsFilter.state_filter & this.filterTemplate.down_critical;
        this.settingsFilter.filter.unreachable_unknown = this.settingsFilter.state_filter & this.filterTemplate.unreachable_unknown;
        this.loadMapData(false);
    }

    handleResize(event: any) {
        if (!this.server_url) {
            return;
        }
        this.buildLayers();
    }
}
