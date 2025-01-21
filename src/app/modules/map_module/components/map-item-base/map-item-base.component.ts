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
import { ContextAction, MapitemBase, MapitemBaseActionObject } from './map-item-base.interface';
import { CdkDrag, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { MapCanvasComponent } from '../map-canvas/map-canvas.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { TranslocoService } from '@jsverse/transloco';
import { Mapline } from '../../pages/mapeditors/Mapeditors.interface';

@Component({
    selector: 'oitc-map-item-base',
    standalone: true,
    imports: [CdkDrag, ContextMenuModule],
    templateUrl: './map-item-base.component.html',
    styleUrl: './map-item-base.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapItemBaseComponent<T extends MapitemBase> implements AfterViewInit {
    @ViewChild('container', {static: true}) containerRef!: ElementRef<HTMLDivElement>;

    public item: InputSignal<T | undefined> = input<T | undefined>();
    public gridSize: InputSignal<{ x: number, y: number }> = input<{ x: number, y: number }>({x: 25, y: 25}); // Grid size for snapping
    public gridEnabled: InputSignal<boolean> = input<boolean>(true);
    public isViewMode: InputSignal<boolean> = input<boolean>(true);

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
    protected type = "item";

    @Output() dropItemEvent = new EventEmitter<MapitemBaseActionObject>();
    @Output() contextActionEvent = new EventEmitter<ContextAction>();

    protected readonly TranslocoService = inject(TranslocoService);

    protected cdr = inject(ChangeDetectorRef);
    private mapCanvasComponent: MapCanvasComponent;

    protected contextMenuItems: MenuItem[] = this.getDefaultContextMenuItems();

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

    public isMapline(item: any): item is Mapline {
        return item && item.startX !== undefined && item.startY !== undefined && item.endX !== undefined && item.endY !== undefined;
    }

    //grid snapping logic
    onDragMove(event: CdkDragMove<any>) {

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

        console.error("drag end");

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

    protected getDefaultContextMenuItems(): MenuItem[] {
        return [
            {
                label: this.TranslocoService.translate('Edit'),
                icon: 'fa fa-cog',
                command: () => {
                    this.cdr.markForCheck();
                }
            },
            {
                label: this.TranslocoService.translate('Delete'),
                styleClass: 'text-danger',
                icon: 'fa fa-trash',
                command: () => {
                    this.contextActionEvent.emit({
                        type: 'delete', data: {
                            id: this.id,
                            x: this.x,
                            y: this.y,
                            map_id: this.mapId,
                        }
                    });
                    this.cdr.markForCheck();
                }
            }
        ]
    }

}
