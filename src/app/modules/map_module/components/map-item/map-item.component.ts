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
import { Data, MapItemRoot, MapItemRootParams } from './map-item.interface';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { MapCanvasComponent } from '../map-canvas/map-canvas.component';
import { NgIf } from '@angular/common';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { MapItemBaseComponent } from '../map-item-base/map-item-base.component';
import { interval, Subscription } from 'rxjs';
import { MapItemService } from './map-item.service';
import { Mapitem } from '../../pages/mapeditors/Mapeditors.interface';
import { ContextActionType, LabelPosition, MapItemType } from '../map-item-base/map-item-base.enum';

@Component({
    selector: 'oitc-map-item',
    standalone: true,
    imports: [CdkDrag, ContextMenuModule, NgIf],
    templateUrl: './map-item.component.html',
    styleUrl: './map-item.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapItemComponent extends MapItemBaseComponent<Mapitem> implements OnInit, OnDestroy {

    public override item: InputSignal<Mapitem | undefined> = input<Mapitem>();
    public refreshInterval = input<number>();

    private subscriptions: Subscription = new Subscription();
    private readonly MapItemService = inject(MapItemService);
    private blinkSubscription: Subscription = new Subscription();

    private uuidForServices: string | null = null;
    private interval: number | null = null;
    protected icon: string = "";
    protected currentIcon: string = "";
    protected icon_property: string = "";
    protected allowView: boolean = false;
    protected label: string = "";

    protected override type = MapItemType.ITEM;

    constructor(parent: MapCanvasComponent) {
        super(parent);
        effect(() => {
            if (!this.isItemDeleted(this.type)) {
                this.onItemObjectIdChange();
            }
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.stopBlink();
        this.stop();
    }

    public ngOnInit(): void {
        if (!this.isItemDeleted(this.type)) {
            this.load();
        }
        if (this.refreshInterval()! > 0) {
            /*MapItemReloadService.setRefreshInterval(this.refreshInterval());
            MapItemReloadService.registerNewItem(uuidForServices, this.mapItem(), updateCallback);*/
        }
    }

    public updateCallback(result: MapItemRoot) {
        if (!result.allowView) {
            this.allowView = false;
            return;
        }

        this.icon = result.data.icon;
        this.icon_property = result.data.icon_property;
        this.allowView = result.allowView;

        this.getLabel(result.data);

        this.currentIcon = this.icon;

        /*if (result.data.data.isAcknowledged === true || result.data.data.isInDowntime === true) {
            BlinkService.registerNewObject(this.uuidForServices, $scope.blinkServiceCallback);
        } else {
            BlinkService.unregisterObject(this.uuidForServices);
        }*/
        this.cdr.markForCheck();
    };

    private load() {
        if (this.uuidForServices === null) {
            //this.uuidForServices = UuidService.v4();
        }

        const params: MapItemRootParams = {
            'angular': true,
            'disableGlobalLoader': true,
            'objectId': this.item()!.object_id as number,
            'mapId': this.item()!.map_id as number,
            'type': this.item()!.type as string
        };

        this.subscriptions.add(this.MapItemService.getMapItem(params)
            .subscribe((result: MapItemRoot) => {
                this.updateCallback(result);
            }));
    };

    private getLabel(data: Data) {
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

    private startBlink() {
        this.blinkSubscription = interval(5000).subscribe(() => {
            if (this.currentIcon === this.icon) {
                this.currentIcon = this.icon_property;
            } else {
                this.currentIcon = this.icon;
            }
            this.cdr.markForCheck();
        });
    };

    private stopBlink() {
        if (this.blinkSubscription) {
            this.blinkSubscription.unsubscribe();
            this.cdr.markForCheck();
        }
    };

    private blinkServiceCallback() {
        if (this.currentIcon === this.icon) {
            this.currentIcon = this.icon_property;
        } else {
            this.currentIcon = this.icon;
        }
        this.cdr.markForCheck();
    };

    private stop() {
        /*BlinkService.unregisterObject(uuidForServices);
        MapItemReloadService.unregisterItem(uuidForServices);*/
    };

    private onItemObjectIdChange() {
        //if(this.init || $scope.item.object_id === null){
        if (this.item()!.object_id === null) {
            //Avoid ajax error if user search a object in item config modal
            return;
        }

        this.load();
    };

    protected override getDefaultContextMenuItems(): MenuItem[] {
        return [
            {
                label: this.TranslocoService.translate('Edit'),
                icon: 'fa fa-cog',
                command: () => {
                    this.cdr.markForCheck();
                }
            },
            {
                separator: true
            },
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
                                } as Mapitem,
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
                                } as Mapitem,
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
                                } as Mapitem,
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
                                } as Mapitem,
                                itemType: this.type
                            });
                            this.cdr.markForCheck();
                        }
                    }
                ]
            },
            {
                separator: true
            },
            {
                label: this.TranslocoService.translate('Delete'),
                styleClass: 'text-danger',
                icon: 'fa fa-trash',
                command: () => {
                    this.contextActionEvent.emit({
                        type: ContextActionType.DELETE,
                        data: {
                            id: this.id,
                            x: this.x,
                            y: this.y,
                            map_id: this.mapId,
                        },
                        itemType: this.type
                    });
                    this.cdr.markForCheck();
                }
            }
        ]
    }

}
