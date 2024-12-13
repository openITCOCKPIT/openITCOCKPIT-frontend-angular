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
    Output,
    ViewChild
} from '@angular/core';
import { ContextAction, Mapitem, MapItemPosition } from './map-item.interface';
import { LabelPosition } from './map-item.enum';
import { CdkDrag, CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { MapCanvasComponent } from '../map-canvas/map-canvas.component';
import { NgClass } from '@angular/common';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'oitc-map-item',
    standalone: true,
    imports: [CdkDrag, NgClass, ContextMenuModule],
    templateUrl: './map-item.component.html',
    styleUrl: './map-item.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapItemComponent implements AfterViewInit {
    @ViewChild('container', {static: true}) containerRef!: ElementRef<HTMLDivElement>;

    public mapItem = input<Mapitem>();

    private position: MapItemPosition = {x: 0, y: 0};

    private _id!: number;
    private _mapId!: number;
    private _x: number = 0;
    private _y: number = 0;
    private _zIndex: string = "0";
    private _labelPosition: number = LabelPosition.BOTTOM;
    protected showLabel: boolean = true;

    public gridSize: { x: number, y: number } = {x: 25, y: 25}; // Grid size for snapping
    public gridEnabled: boolean = true;
    public isViewMode: boolean = true;

    @Output() dropItemEvent = new EventEmitter<Mapitem>();
    @Output() contextActionEvent = new EventEmitter<ContextAction>();

    private readonly TranslocoService = inject(TranslocoService);

    private cdr = inject(ChangeDetectorRef);
    private initialOffset: { x: number, y: number } = {x: 0, y: 0}; // Initial offset when dragging (needed to prevent bouncing after start dragging)
    private mapCanvasComponent: MapCanvasComponent;

    protected contextMenuItems: MenuItem[] = this.getDefaultContextMenuItems();

    constructor(private parent: MapCanvasComponent) {
        this.mapCanvasComponent = parent;
        effect(() => {
            this._id = this.mapItem()!.id;
            this._mapId = this.mapItem()!.map_id;
            this._x = this.mapItem()!.x;
            this._y = this.mapItem()!.y;
            this._zIndex = this.mapItem()!.z_index!;
            this._labelPosition = this.mapItem()!.label_possition!;
            this.showLabel = this.mapItem()!.show_label!;
            this.setPosition();
            this.setLayer(this._zIndex);
        });
    }

    public setLayer(layer: string): void {
        this.containerRef.nativeElement.style.zIndex = layer;
        this.cdr.markForCheck();
    }

    public setPosition(): void {
        this.position = {x: this._x, y: this._y};
        this.containerRef.nativeElement.style.left = `${this.position.x}px`;
        this.containerRef.nativeElement.style.top = `${this.position.y}px`;
        this.cdr.markForCheck();
    }

    ngAfterViewInit() {
        this.cdr.markForCheck();
        this.setLayer(this._zIndex);
        this.setPosition();
    }

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

    public onDragEnd(cdkEvent: CdkDragEnd<any>) {

        console.error("drag end");

        const mapCanvas = this.mapCanvasComponent.canvasContainerRef.nativeElement.getBoundingClientRect();
        const mapItem = cdkEvent.source.element.nativeElement.getBoundingClientRect();

        const posX = mapItem.x - mapCanvas.x;
        const posY = mapItem.y - mapCanvas.y;

        this.dropItemEvent.emit({id: this._id, x: posX, y: posY, map_id: this._mapId});

        this.cdr.markForCheck();
    }

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

    public getLabelPositionClass(): string {
        return 'map-element-label-' + LabelPosition[this._labelPosition].toLowerCase();
    }

    private getDefaultContextMenuItems(): MenuItem[] {
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
                                type: 'labelPosition',
                                data: {
                                    id: this._id,
                                    x: this._x,
                                    y: this._y,
                                    map_id: this._mapId,
                                    label_possition: LabelPosition.TOP
                                }
                            });
                            this.cdr.markForCheck();
                        }
                    },
                    {
                        label: this.TranslocoService.translate('Right'),
                        icon: 'fa fa-right-long',
                        command: () => {
                            this.contextActionEvent.emit({
                                type: 'labelPosition',
                                data: {
                                    id: this._id,
                                    x: this._x,
                                    y: this._y,
                                    map_id: this._mapId,
                                    label_possition: LabelPosition.RIGHT
                                }
                            });
                            this.cdr.markForCheck();
                        }
                    },
                    {
                        label: this.TranslocoService.translate('Bottom'),
                        icon: 'fa fa-down-long',
                        command: () => {
                            this.contextActionEvent.emit({
                                type: 'labelPosition',
                                data: {
                                    id: this._id,
                                    x: this._x,
                                    y: this._y,
                                    map_id: this._mapId,
                                    label_possition: LabelPosition.BOTTOM
                                }
                            });
                            this.cdr.markForCheck();
                        }
                    },
                    {
                        label: this.TranslocoService.translate('Left'),
                        icon: 'fa fa-left-long',
                        command: () => {
                            this.contextActionEvent.emit({
                                type: 'labelPosition',
                                data: {
                                    id: this._id,
                                    x: this._x,
                                    y: this._y,
                                    map_id: this._mapId,
                                    label_possition: LabelPosition.LEFT
                                }
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
                        type: 'delete', data: {
                            id: this._id,
                            x: this._x,
                            y: this._y,
                            map_id: this._mapId,
                        }
                    });
                    this.cdr.markForCheck();
                }
            }
        ]
    }

}
