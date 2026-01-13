import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    input,
    InputSignal,
    OnDestroy,
    OnInit
} from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericValidationError } from '../../../../generic-responses';
import { MapeditorsService } from '../../pages/mapeditors/mapeditors.service';
import { Acl, MapRoot } from '../../pages/mapeditors/mapeditors.interface';
import { parseInt } from 'lodash';
import { MapSummaryItemComponent } from '../map-summary-item/map-summary-item.component';
import { ServiceOutputItemComponent } from '../service-output-item/service-output-item.component';
import { TemperatureItemComponent } from '../temperature-item/temperature-item.component';
import { TrafficlightItemComponent } from '../trafficlight-item/trafficlight-item.component';
import { CylinderItemComponent } from '../cylinder-item/cylinder-item.component';
import { TachoItemComponent } from '../tacho-item/tacho-item.component';
import { PerfdataTextItemComponent } from '../perfdata-text-item/perfdata-text-item.component';
import { GraphItemComponent } from '../graph-item/graph-item.component';
import { MapIconComponent } from '../map-icon/map-icon.component';
import { MapLineComponent } from '../map-line/map-line.component';
import { MapTextComponent } from '../map-text/map-text.component';
import { MapItemComponent } from '../map-item/map-item.component';
import { MapCanvasComponent } from '../map-canvas/map-canvas.component';

import { MapSummaryToasterService } from '../map-summary-toaster/map-summary-toaster.service';
import { MapSummaryToasterComponent } from '../map-summary-toaster/map-summary-toaster.component';

@Component({
    selector: 'oitc-map-view',
    standalone: true,
    imports: [
    MapSummaryItemComponent,
    ServiceOutputItemComponent,
    TemperatureItemComponent,
    TrafficlightItemComponent,
    CylinderItemComponent,
    TachoItemComponent,
    PerfdataTextItemComponent,
    GraphItemComponent,
    MapIconComponent,
    MapLineComponent,
    MapTextComponent,
    MapItemComponent,
    MapCanvasComponent,
    MapSummaryToasterComponent
],
    templateUrl: './map-view.component.html',
    styleUrl: './map-view.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapViewComponent implements OnInit, OnDestroy {

    public mapId: InputSignal<number> = input<number>(0);
    // default value is false, because to prevent to start reload interval on normal map view (too many item requests)
    // map item request are handled by map item component and the reload service
    public rotate: InputSignal<boolean | undefined> = input<boolean | undefined>(false);

    private readonly router = inject(Router);
    private subscriptions: Subscription = new Subscription();
    private intervalSubscription: Subscription = new Subscription();
    private MapeditorsService: MapeditorsService = inject(MapeditorsService);
    private readonly MapSummaryToasterService = inject(MapSummaryToasterService);
    private route = inject(ActivatedRoute);
    public errors: GenericValidationError | null = null;
    private cdr = inject(ChangeDetectorRef);

    private init = true;
    protected refreshInterval: number = 0;
    private toasterTimeout: any = null;

    /*private timer;
    private interval;*/
    protected map!: MapRoot;
    private acl!: Acl;

    constructor() {
        effect(() => {
            this.onMapIdChange();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.stopInterval();
    }

    public ngOnInit(): void {
    }

    private load() {
        if (this.mapId() !== undefined) {
            this.subscriptions.add(this.MapeditorsService.loadMapView(this.mapId() as number)
                .subscribe((result) => {
                    this.refreshInterval = parseInt(result.map.Map.refresh_interval!.toString(), 10);
                    this.map = result.map;
                    this.acl = result.ACL;

                    if (this.init) {
                        if (this.refreshInterval > 1000 && this.rotate() === undefined) {
                            //Only refresh maps if they are not in a rotation.
                            //Rotation will also refresh maps on change of current map
                            this.stopInterval();

                            this.intervalSubscription = interval(this.refreshInterval).subscribe(() => {
                                this.load();
                                this.cdr.markForCheck();
                            });
                        }
                    }

                    this.init = false;
                    this.cdr.markForCheck();
                }));
        }
    };

    private stopInterval() {
        if (this.intervalSubscription) {
            this.intervalSubscription.unsubscribe();
        }
    }

    public showSummaryStateDelayed(item: any, summary: boolean): void { //--> is summary item (true / false)
        this.cancelTimer();
        if (item) {
            this.toasterTimeout = setTimeout(() => {
                this.MapSummaryToasterService.setItemToaster(item, summary);
            }, 500);
        }
    }

    public cancelTimer() {
        if (this.toasterTimeout) {
            clearTimeout(this.toasterTimeout);
        }

        this.toasterTimeout = null;
    }

    protected navigate(item: any) {

        switch (item.type) {
            case 'host':
                if (this.acl.hosts.browser) {
                    this.router.navigate(['/hosts/browser/' + item.object_id]);
                }
                break;

            case 'service':
                if (this.acl.services.browser) {
                    this.router.navigate(['/services/browser/' + item.object_id]);
                }
                break;

            case 'hostgroup':
                if (this.acl.hostgroups.extended) {
                    this.router.navigate(['/hostgroups/extended/' + item.object_id]);
                }
                break;

            case 'servicegroup':
                if (this.acl.servicegroups.extended) {
                    this.router.navigate(['/servicegroups/extended/' + item.object_id]);
                }
                break;

            case 'map':
                this.router.navigate(['/map_module/mapeditors/view/' + item.object_id]);
                break;

            default:
                break;
        }
    };

    private onMapIdChange() {
        this.load();
    }

}
