import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    ElementRef,
    EventEmitter,
    inject,
    input,
    InputSignal,
    Output,
    ViewChild
} from '@angular/core';
import { ContextAction, MapitemBase, MapitemBaseActionObject, ResizedEvent } from './map-item-base.interface';
import { CdkDrag, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { MapCanvasComponent } from '../map-canvas/map-canvas.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { TranslocoService } from '@jsverse/transloco';
import { Mapitem, Mapline } from '../../pages/mapeditors/Mapeditors.interface';
import { ContextActionType, MapItemType } from './map-item-base.enum';
import { NgIf } from '@angular/common';

@Component({
    selector: 'oitc-map-item-base',
    standalone: true,
    imports: [CdkDrag, ContextMenuModule, NgIf],
    templateUrl: './map-item-base.component.html',
    styleUrl: './map-item-base.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapItemBaseComponent<T extends MapitemBase> implements AfterViewInit {
    @ViewChild('container', {static: true}) containerRef!: ElementRef<HTMLDivElement>;

    public item: InputSignal<T | undefined> = input<T | undefined>();
    public layers: InputSignal<string[]> = input<string[]>([]); // Layer options for context menu
    public gridSize: InputSignal<{ x: number, y: number }> = input<{ x: number, y: number }>({x: 25, y: 25}); // Grid size for snapping
    public gridEnabled: InputSignal<boolean> = input<boolean>(true);
    public isViewMode: InputSignal<boolean> = input<boolean>(false); // View mode for disabling drag and drop and context menu

    @Output() resizedEvent = new EventEmitter<ResizedEvent>();

    protected id!: number;
    protected mapId!: number;
    protected x: number = 0;
    protected y: number = 0;
    protected zIndex: string = "0";
    protected startX?: number;
    protected startY?: number;
    protected endX?: number;
    protected endY?: number;
    protected oldStartX?: number;
    protected oldStartY?: number;
    protected oldEndX?: number;
    protected oldEndY?: number;

    // will be overridden by child components
    // this is for the drop event to know which type of item is dropped
    protected type = MapItemType.ITEM;

    @Output() dropItemEvent = new EventEmitter<MapitemBaseActionObject>();
    @Output() contextActionEvent = new EventEmitter<ContextAction>();

    protected readonly TranslocoService = inject(TranslocoService);

    protected cdr = inject(ChangeDetectorRef);
    protected mapCanvasComponent: MapCanvasComponent;

    protected contextMenuItems: MenuItem[] = this.getContextMenuItems();

    /**
     * TODO: There is a bug on map items with resizable directive. When you drag the item, the drag starts only after release the mouse button.
     * This is because when the item is resizable, you have to place the cdkDragHandle inside the content of the item, so you can drag the element and resize it in the corner.
     * If you remove the cdkDragHandle from the content, the drag will work as expected, but you are not able to resize the item.
     */

    constructor(protected parent: MapCanvasComponent) {
        this.mapCanvasComponent = parent;
        effect(() => {
            this.id = this.item()!.id;
            this.mapId = this.item()!.map_id;
            if (this.isMapline(this.item())) {
                this.startX = this.item()!.startX;
                this.startY = this.item()!.startY;
                this.endX = this.item()!.endX;
                this.endY = this.item()!.endY;
                this.oldStartX = this.startX;
                this.oldStartY = this.startY;
                this.oldEndX = this.endX;
                this.oldEndY = this.endY;
            } else {
                this.x = this.item()!.x;
                this.y = this.item()!.y;
            }
            this.zIndex = this.item()!.z_index!;
            this.setPosition();
            this.setLayer(this.zIndex);
            this.contextMenuItems = this.getContextMenuItems();
        });
    }

    public setLayer(layer: string): void {
        this.containerRef.nativeElement.style.zIndex = layer;
        this.cdr.markForCheck();
    }

    public setPosition(): void {
        let x;
        let y;
        if (this.isMapline(this.item())) {
            x = this.startX!;
            y = this.startY!;
        } else {
            x = this.x
            y = this.y;
        }
        this.containerRef.nativeElement.style.left = `${x}px`;
        this.containerRef.nativeElement.style.top = `${y}px`;

        this.cdr.markForCheck();
    }

    ngAfterViewInit() {
        this.cdr.markForCheck();
        this.setLayer(this.zIndex);
        this.setPosition();
    }

    // difference between mapline and all other item, cause maplines have no x and y
    public isMapline(item: any): item is Mapline {
        return item && item.startX !== undefined && item.startY !== undefined && item.endX !== undefined && item.endY !== undefined;
    }

    // check if item is deleted to prevent multiple request after delete through effect()
    // type has to be given here because the type of parent class is wrong
    public isItemDeleted(type: MapItemType): boolean {
        return this.parent.currentDeletedItem()?.id === this.id && this.parent.currentDeletedItem()?.type === type;
    }

    //grid snapping logic
    public onDragMove(event: CdkDragMove<any>) {

        let posX;
        let posY;
        const distanceX = event.distance.x;
        const distanceY = event.distance.y;

        if (!this.gridEnabled()) {
            posX = distanceX;
            posY = distanceY;
        } else {
            posX = Math.round(distanceX / this.gridSize().x) * this.gridSize().x;
            posY = Math.round(distanceY / this.gridSize().y) * this.gridSize().y;
        }

        event.source.element.nativeElement.style.transform = `translate(${posX}px, ${posY}px)`;
        this.cdr.markForCheck();
    }

    // fires drag end event and grid snapping logic
    public onDragEnd(cdkEvent: CdkDragEnd<any>) {

        // grid snapping logic
        const mapCanvas = this.mapCanvasComponent.canvasContainerRef.nativeElement.getBoundingClientRect();
        const mapItem = cdkEvent.source.element.nativeElement.getBoundingClientRect();

        let posX = mapItem.x - mapCanvas.x;
        let posY = mapItem.y - mapCanvas.y;

        if (this.gridEnabled()) {
            const currentLeftOffset = Math.round(posX) % this.gridSize().x;
            const currentTopOffset = Math.round(posY) % this.gridSize().y;

            if (currentLeftOffset > 0 || currentTopOffset > 0) {
                posX = Math.round(posX - currentLeftOffset);
                posY = Math.round(posY - currentTopOffset);
            }
        }

        if (this.isMapline(this.item())) {
            //Get movement distance

            let distanceX = this.oldStartX! - posX;
            distanceX = distanceX * -1;
            let distanceY = this.oldStartY! - posY;
            distanceY = distanceY * -1;

            this.endX = this.oldEndX! + distanceX;
            this.endY = this.oldEndY! + distanceY;

            this.startX = posX;
            this.startY = posY;

            this.oldStartX = this.startX;
            this.oldStartY = this.startY;
            this.oldEndX = this.endX;
            this.oldEndY = this.endY;

        } else {
            this.x = posX;
            this.y = posY;
        }

        this.setPosition();
        cdkEvent.source.element.nativeElement.style.transform = 'none';

        // emit drop event
        this.dropItemEvent.emit({
            data: {
                id: this.id,
                x: posX,
                y: posY,
                map_id: this.mapId,
                startX: this.startX,
                startY: this.startY,
                endX: this.endX,
                endY: this.endY
            },
            action: 'dragstop',
            type: this.type
        });

        this.cdr.markForCheck();
    }

    // generates context menu
    private getContextMenuItems(): MenuItem[] {

        let layerOptions: MenuItem[] = [];
        for (let key in this.layers()) {
            let icon = "";
            if (key === this.item()!.z_index) {
                icon = "fa fa-check";
            }
            layerOptions.push({
                label: this.layers()[key],
                icon: icon,
                command: () => {
                    this.contextActionEvent.emit({
                        type: ContextActionType.LAYER,
                        data: {
                            id: this.id,
                            x: this.x,
                            y: this.y,
                            map_id: this.mapId,
                            z_index: key
                        } as Mapitem,
                        itemType: this.type
                    });
                    this.cdr.markForCheck();
                }
            });
        }

        const extraItems = this.getExtraContextMenuItems().flat();
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
                label: this.TranslocoService.translate('Layers'),
                icon: 'fa fa-layer-group',
                items: layerOptions
            },
            ...extraItems,
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
        ];
    }

    // can be used to add extra context menu items in child components
    protected getExtraContextMenuItems(): MenuItem[] {
        return [];
    }

    // resize event for resizable items
    // type has to be given here because the type of parent class is wrong
    // in template of child you have to use the onResizeStop event to emit the event (example: (resizeStop)="onResizeStop($event, type)"
    protected onResizeStop(event: { width: number, height: number }, itemType: MapItemType) {
        this.resizedEvent.emit({
            id: this.id,
            mapId: this.mapId,
            width: event.width,
            height: event.height,
            itemType: itemType
        });
        this.cdr.markForCheck();
    }

}
