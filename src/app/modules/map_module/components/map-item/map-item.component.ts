import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { MapElementPosition } from './map-item.interface';
import { LabelPosition } from './map-item.enum';
import { CdkDrag, CdkDragStart } from '@angular/cdk/drag-drop';

@Component({
    selector: 'oitc-map-item',
    standalone: true,
    imports: [CdkDrag],
    templateUrl: './map-item.component.html',
    styleUrl: './map-item.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapItemComponent implements AfterViewInit, OnChanges {
    @ViewChild('container', {static: true}) containerRef!: ElementRef<HTMLDivElement>;

    @Input() layer: number = 0;
    @Input() position: MapElementPosition = {x: 0, y: 0};
    @Input() labelPosition: LabelPosition = LabelPosition.RIGHT;
    @Input() showLabel: boolean = false;
    @Input() dragEnabled: boolean = true;
    @Input({required: true}) itemId!: number;
    @Input() gridSize: { x: number, y: number } = {x: 25, y: 25}; // Grid size for snapping

    private cdr = inject(ChangeDetectorRef);
    private initialOffset: { x: number, y: number } = {x: 0, y: 0};

    constructor() {
    }

    public setLayer(layer: number): void {
        this.containerRef.nativeElement.style.zIndex = layer.toString();
        this.cdr.markForCheck();
    }

    public setPosition(position: MapElementPosition): void {
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
        /*if (changes['position']) {
            this.setPosition(this.position);
        }*/
    }

    public onDragStart(cdkEvent: CdkDragStart<any>) {
        cdkEvent.event.preventDefault();
        let clientX: number = 0;
        let clientY: number = 0;

        if (cdkEvent.event instanceof TouchEvent) {
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
        console.error("drag start", this.initialOffset.x, this.initialOffset.y);
        //event.dataTransfer?.setData('text/plain', JSON.stringify({index: this.index, initialPosition: this.position}));
    }

    public computeDragRenderPos = (pos: { x: number, y: number }) => {
        const snappedX = Math.round((pos.x - this.initialOffset.x) / this.gridSize.x) * this.gridSize.x;
        const snappedY = Math.round((pos.y - this.initialOffset.y) / this.gridSize.y) * this.gridSize.y;
        return {x: snappedX, y: snappedY};
    }

}
