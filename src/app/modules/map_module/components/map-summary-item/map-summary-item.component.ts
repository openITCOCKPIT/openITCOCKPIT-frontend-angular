import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    InputSignal,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MapCanvasComponent } from '../map-canvas/map-canvas.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MapItemBaseComponent } from '../map-item-base/map-item-base.component';
import { Mapsummaryitem } from '../../pages/mapeditors/Mapeditors.interface';
import { ContextActionType, LabelPosition, MapItemType } from '../map-item-base/map-item-base.enum';
import { interval, Subscription } from 'rxjs';
import { MapSummaryItemService } from './map-summary-item.service';
import { Data, MapSummaryItemRoot, MapSummaryItemRootParams } from './map-summary-item.interface';
import { NgIf } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { ResizableDirective } from '../../../../directives/resizable.directive';

@Component({
    selector: 'oitc-map-summary-item',
    standalone: true,
    imports: [CdkDrag, ContextMenuModule, NgIf, CdkDragHandle, ResizableDirective],
    templateUrl: './map-summary-item.component.html',
    styleUrl: './map-summary-item.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapSummaryItemComponent extends MapItemBaseComponent<Mapsummaryitem> implements OnInit, OnDestroy {
    @ViewChild(ResizableDirective) resizableDirective!: ResizableDirective;

    public override item: InputSignal<Mapsummaryitem | undefined> = input<Mapsummaryitem>();
    public refreshInterval = input<number>(0);

    private subscriptions: Subscription = new Subscription();
    private readonly MapSummaryItemService = inject(MapSummaryItemService);

    protected override type = MapItemType.SUMMARYITEM;

    private interval: number | null = null;
    private statusUpdateInterval: Subscription = new Subscription();
    protected allowView: boolean = false;
    protected init: boolean = true;
    protected bitMaskHostState: number = 0;
    protected bitMaskServiceState: number = 0;
    protected label: string = "";
    private intervalStartet: boolean = false; // needed to prevent multiple interval subscriptions

    constructor(parent: MapCanvasComponent) {
        super(parent);
    }

    public ngOnInit(): void {

        if (this.item()!.size_x <= 0) {
            this.item()!.size_x = 100;
        }

        this.load();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.stop();
    }

    private load() {

        const params: MapSummaryItemRootParams = {
            'angular': true,
            'disableGlobalLoader': true,
            'objectId': this.item()!.object_id as number,
            'mapId': this.item()!.map_id as number,
            'type': this.item()!.type as string
        };

        this.subscriptions.add(this.MapSummaryItemService.getMapSummaryItem(params)
            .subscribe((result: MapSummaryItemRoot) => {
                this.bitMaskHostState = result.data.BitMaskHostState;
                this.bitMaskServiceState = result.data.BitMaskServiceState;
                this.allowView = result.allowView;

                this.init = false;
                if (this.allowView) {
                    this.getLabel(result.data);
                }
                this.initRefreshTimer();
                this.resizableDirective.setLastWidthHeight(this.item()!.size_x, this.item()!.size_y);
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

    private stop() {
        if (this.intervalStartet) {
            this.statusUpdateInterval.unsubscribe();
            this.cdr.markForCheck();
        }
    };

    private initRefreshTimer() {
        if (this.refreshInterval() > 0 && !this.intervalStartet) {
            this.intervalStartet = true;
            this.statusUpdateInterval = interval(this.refreshInterval()).subscribe(() => {
                this.load();
            });
        }
    };

    protected override getExtraContextMenuItems(): MenuItem[] {
        return [
            {
                label: this.TranslocoService.translate('Label position'),
                icon: 'fa fa-font',
                items: [
                    {
                        label: this.TranslocoService.translate('Top'),
                        icon: 'fa fa-up-long',
                        command: () => {
                            this.contextActionEvent.emit({
                                type: ContextActionType.LABEL_POSITION,
                                data: {
                                    id: this.id,
                                    x: this.x,
                                    y: this.y,
                                    map_id: this.mapId,
                                    label_possition: LabelPosition.TOP
                                } as Mapsummaryitem,
                                itemType: this.type
                            });
                            this.cdr.markForCheck();
                        }
                    },
                    {
                        label: this.TranslocoService.translate('Right'),
                        icon: 'fa fa-right-long',
                        command: () => {
                            this.contextActionEvent.emit({
                                type: ContextActionType.LABEL_POSITION,
                                data: {
                                    id: this.id,
                                    x: this.x,
                                    y: this.y,
                                    map_id: this.mapId,
                                    label_possition: LabelPosition.RIGHT
                                } as Mapsummaryitem,
                                itemType: this.type
                            });
                            this.cdr.markForCheck();
                        }
                    },
                    {
                        label: this.TranslocoService.translate('Bottom'),
                        icon: 'fa fa-down-long',
                        command: () => {
                            this.contextActionEvent.emit({
                                type: ContextActionType.LABEL_POSITION,
                                data: {
                                    id: this.id,
                                    x: this.x,
                                    y: this.y,
                                    map_id: this.mapId,
                                    label_possition: LabelPosition.BOTTOM
                                } as Mapsummaryitem,
                                itemType: this.type
                            });
                            this.cdr.markForCheck();
                        }
                    },
                    {
                        label: this.TranslocoService.translate('Left'),
                        icon: 'fa fa-left-long',
                        command: () => {
                            this.contextActionEvent.emit({
                                type: ContextActionType.LABEL_POSITION,
                                data: {
                                    id: this.id,
                                    x: this.x,
                                    y: this.y,
                                    map_id: this.mapId,
                                    label_possition: LabelPosition.LEFT
                                } as Mapsummaryitem,
                                itemType: this.type
                            });
                            this.cdr.markForCheck();
                        }
                    }
                ]
            }
        ]
    }

}
