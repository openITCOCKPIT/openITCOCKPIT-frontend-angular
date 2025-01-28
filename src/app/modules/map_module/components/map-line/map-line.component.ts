import { MapItemBaseComponent } from '../map-item-base/map-item-base.component';
import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    input,
    InputSignal,
    OnDestroy,
    OnInit
} from '@angular/core';
import { Data, MapLineRoot, MapLineRootParams } from './map-line.interface';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { MapCanvasComponent } from '../map-canvas/map-canvas.component';
import { NgClass, NgIf } from '@angular/common';
import { ContextMenuModule } from 'primeng/contextmenu';
import { interval, Subscription } from 'rxjs';
import { MapLineService } from './map-line.service';
import { Mapline } from '../../pages/mapeditors/Mapeditors.interface';
import { MapItemType } from '../map-item-base/map-item-base.enum';

@Component({
    selector: 'oitc-map-line',
    standalone: true,
    imports: [CdkDrag, NgClass, ContextMenuModule, NgIf],
    templateUrl: './map-line.component.html',
    styleUrl: './map-line.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapLineComponent extends MapItemBaseComponent<Mapline> implements OnInit, OnDestroy {

    public override item: InputSignal<Mapline | undefined> = input<Mapline>();
    public refreshInterval = input<number>(0);

    private subscriptions: Subscription = new Subscription();
    private readonly MapLineService = inject(MapLineService);
    private statusUpdateInterval: Subscription = new Subscription();

    protected allowView: boolean = false;
    protected label: string = "";
    protected width: number = 0;
    protected top: number = 0;
    protected left: number = 0;
    protected origin: string = "";
    protected arctan: number = 0;
    protected background: string = "";
    protected init: boolean = true;

    protected override type = MapItemType.LINE;

    constructor(parent: MapCanvasComponent) {
        super(parent);
        effect(() => {
            if (!this.isItemDeleted(this.type)) {
                this.onItemChange();
            }
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.stop();
    }

    public ngOnInit(): void {
        this.initLine();

        if (this.item()!.type === 'stateless') {
            this.background = 'bg-color-black';
            this.allowView = true;
            this.init = false;
        } else {
            if (!this.isItemDeleted(this.type)) {
                this.load();
            }
        }
    }

    private initLine() {

        let startX = this.item()?.startX;
        let startY = this.item()?.startY;
        let endX = this.item()?.endX;
        let endY = this.item()?.endY;

        if (!startY || !startX || !endY || !endX) {
            return;
        }

        this.item()!.startX = parseInt(startX.toString(), 10);
        this.item()!.startY = parseInt(startY.toString(), 10);
        this.item()!.endX = parseInt(endX.toString(), 10);
        this.item()!.endY = parseInt(endY.toString(), 10);

        this.zIndex = parseInt(this.item()!.z_index!.toString(), 10).toString();

        let distance = Math.sqrt(
            Math.pow((endX - startX), 2) + Math.pow((endY - startY), 2)
        );

        this.width = parseInt(distance.toString(), 10);

        this.top = startY;
        if (startX > endX) {
            this.left = startX;
            this.origin = 'top right';
        }

        if (endX > startX) {
            this.left = startX;
            this.origin = 'top left';
        }

        let tan = (endY - startY) / (endX - startX);
        let atan = Math.atan((endY - startY) / (endX - startX)); //tan / Math.PI * 180;
        this.arctan = atan * 180 / Math.PI;
        this.cdr.markForCheck();
    };

    private load() {
        const params: MapLineRootParams = {
            'angular': true,
            'disableGlobalLoader': true,
            'objectId': this.item()!.object_id as number,
            'mapId': this.item()!.map_id as number,
            'type': this.item()!.type as string
        };

        this.subscriptions.add(this.MapLineService.getMapLine(params)
            .subscribe((result: MapLineRoot) => {
                this.background = result.data.background;
                this.allowView = result.allowView;
                this.init = false;
                if (this.allowView) {
                    this.getLabel(result.data);
                }
                this.initRefreshTimer();
                this.cdr.markForCheck();
            }));
    };

    protected getLabel(data: Data) {
        this.label = '';
        switch (this.item()!.type) {
            case 'host':
                this.label = data.Host.hostname;
                break;

            case 'service':
                this.label = data.Host.hostname + '/' + data.Service.servicename;
                break;

            case 'hostgroup':
                this.label = data.Hostgroup.name;
                break;

            case 'servicegroup':
                this.label = data.Servicegroup.name;
                break;

            case 'map':
                this.label = data.Map.name;
                break;
        }
        this.cdr.markForCheck();
    };

    private initRefreshTimer() {
        if (this.item()!.type !== 'stateless') {
            if (this.refreshInterval() > 0 && !this.statusUpdateInterval) {
                this.statusUpdateInterval = interval(this.refreshInterval()).subscribe(() => {
                    this.load();
                });
            }
        }
    };

    private stop() {
        if (this.statusUpdateInterval) {
            this.statusUpdateInterval.unsubscribe();
            this.cdr.markForCheck();
        }
    };

    private onItemChange() {
        if (this.init || this.item()!.object_id === null) {
            if (this.item()!.type !== 'stateless') {
                //Avoid ajax error if user search a object in line config modal
                return;
            }
        }

        this.initLine();
        if (this.item()!.type !== 'stateless') {
            this.load();
        }
    }

}
