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
import { ContextAction, MapitemBase, MapItemPosition } from './map-item-base.interface';
import { CdkDrag, CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
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

    protected position: MapItemPosition = {x: 0, y: 0};

    protected id!: number;
    protected mapId!: number;
    protected x: number = 0;
    protected y: number = 0;
    protected zIndex: string = "0";
    protected startX?: number;
    protected startY?: number;
    protected endX?: number;
    protected endY?: number;

    public gridSize: { x: number, y: number } = {x: 25, y: 25}; // Grid size for snapping
    public gridEnabled: boolean = true;
    public isViewMode: boolean = true;

    @Output() dropItemEvent = new EventEmitter<MapitemBase>();
    @Output() contextActionEvent = new EventEmitter<ContextAction>();

    protected readonly TranslocoService = inject(TranslocoService);

    protected cdr = inject(ChangeDetectorRef);
    private initialOffset: { x: number, y: number } = {x: 0, y: 0}; // Initial offset when dragging (needed to prevent bouncing after start dragging)
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
        if (this.isMapline(this.item())) {
            this.position = {x: this.startX!, y: this.startY!};
        } else {
            this.position = {x: this.x, y: this.y};
        }
        this.containerRef.nativeElement.style.left = `${this.position.x}px`;
        this.containerRef.nativeElement.style.top = `${this.position.y}px`;
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

    // sets initial offset when dragging starts needed to prevent bouncing after start dragging)
    public onDragStart(cdkEvent: CdkDragStart<any>) {
        cdkEvent.event.preventDefault();

        let clientX: number = 0;
        let clientY: number = 0;

        if (typeof TouchEvent !== 'undefined' && cdkEvent.event instanceof TouchEvent) {
            let event = cdkEvent.event as TouchEvent;
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            let event = cdkEvent.event as MouseEvent;
            clientX = event.clientX;
            clientY = event.clientY;
        }

        const rect = this.containerRef.nativeElement.getBoundingClientRect();
        this.initialOffset = {x: clientX - rect.left, y: clientY - rect.top};
        this.cdr.markForCheck();
        console.error("drag start", this.initialOffset.x, this.initialOffset.y);
    }

    // fires drag end event
    public onDragEnd(cdkEvent: CdkDragEnd<any>) {

        console.error("drag end");

        const mapCanvas = this.mapCanvasComponent.canvasContainerRef.nativeElement.getBoundingClientRect();
        const mapItem = cdkEvent.source.element.nativeElement.getBoundingClientRect();

        const posX = mapItem.x - mapCanvas.x;
        const posY = mapItem.y - mapCanvas.y;

        this.dropItemEvent.emit({
            id: this.id,
            x: posX,
            y: posY,
            map_id: this.mapId,
            startX: this.startX,
            startY: this.startY,
            endX: this.endX,
            endY: this.endY,
        })
        ;

        this.cdr.markForCheck();
    }

    //grid snapping logic
    public computeDragRenderPos = (pos: { x: number, y: number }) => {
        let posX;
        let posY;
        if (!this.gridEnabled) {
            posX = pos.x - this.initialOffset.x;
            posY = pos.y - this.initialOffset.y;
        } else {
            posX = Math.round((pos.x - this.initialOffset.x) / this.gridSize.x) * this.gridSize.x;
            posY = Math.round((pos.y - this.initialOffset.y) / this.gridSize.y) * this.gridSize.y;
        }
        return {x: posX, y: posY};
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
