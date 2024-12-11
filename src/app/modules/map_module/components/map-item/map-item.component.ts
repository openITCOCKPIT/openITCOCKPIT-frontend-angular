import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
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
export class MapItemComponent implements AfterViewInit, OnChanges {
    @ViewChild('container', {static: true}) containerRef!: ElementRef<HTMLDivElement>;

    @Input() layer: number = 0;
    @Input() position: MapItemPosition = {x: 0, y: 0};
    @Input() labelPosition: LabelPosition = LabelPosition.RIGHT;
    @Input() showLabel: boolean = true;
    @Input() dragEnabled: boolean = true;
    @Input({required: true}) itemId!: number;
    @Input({required: true}) mapId!: string;
    @Input() gridSize: { x: number, y: number } = {x: 25, y: 25}; // Grid size for snapping
    @Input() gridEnabled: boolean = true;

    @Output() dropItemEvent = new EventEmitter<Mapitem>();
    @Output() contextActionEvent = new EventEmitter<ContextAction>();

    private readonly TranslocoService = inject(TranslocoService);

    private cdr = inject(ChangeDetectorRef);
    private initialOffset: { x: number, y: number } = {x: 0, y: 0}; // Initial offset when dragging (needed to prevent bouncing after start dragging)
    private mapCanvasComponent: MapCanvasComponent;

    protected contextMenuItems: MenuItem[] = [
        {
            label: this.TranslocoService.translate('Edit'),
            icon: 'fa fa-cog',
            command: () => {
                console.log('Edit');
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
                        this.labelPosition = LabelPosition.TOP;
                        this.cdr.markForCheck();
                        console.log('Top');
                    }
                },
                {
                    label: this.TranslocoService.translate('Right'),
                    icon: 'fa fa-right-long',
                    command: () => {
                        this.labelPosition = LabelPosition.RIGHT;
                        this.cdr.markForCheck();
                        console.log('Right');
                    }
                },
                {
                    label: this.TranslocoService.translate('Bottom'),
                    icon: 'fa fa-down-long',
                    command: () => {
                        this.labelPosition = LabelPosition.BOTTOM;
                        this.cdr.markForCheck();
                        console.log('Bottom');
                    }
                },
                {
                    label: this.TranslocoService.translate('Left'),
                    icon: 'fa fa-left-long',
                    command: () => {
                        this.labelPosition = LabelPosition.LEFT;
                        this.cdr.markForCheck();
                        console.log('Left');
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
                console.log('Delete');
            }
        }
    ];

    constructor(private parent: MapCanvasComponent) {
        this.mapCanvasComponent = parent;
    }

    public setLayer(layer: number): void {
        this.containerRef.nativeElement.style.zIndex = layer.toString();
        this.cdr.markForCheck();
    }

    public setPosition(position: MapItemPosition): void {
        this.containerRef.nativeElement.style.left = `${position.x}px`;
        this.containerRef.nativeElement.style.top = `${position.y}px`;
        this.cdr.markForCheck();
    }

    ngAfterViewInit() {
        this.cdr.markForCheck();
        this.setLayer(this.layer);
        this.setPosition(this.position);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['position']) {
            this.setPosition(this.position);
        }
        if (changes['layer']) {
            this.setLayer(this.layer);
        }
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

        this.dropItemEvent.emit({id: this.itemId, x: posX, y: posY, map_id: this.mapId});

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
        return 'map-element-label-' + this.labelPosition;
    };

}
