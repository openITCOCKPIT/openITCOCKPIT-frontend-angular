import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    ViewChild
} from '@angular/core';
import { MapItemPosition } from './map-canvas.interface';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { MapItemComponent } from '../map-item/map-item.component';

@Component({
    selector: 'oitc-map-canvas',
    standalone: true,
    imports: [
        CdkDropList
    ],
    templateUrl: './map-canvas.component.html',
    styleUrl: './map-canvas.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapCanvasComponent implements AfterViewInit {
    @ViewChild('mapCanvasContainer', {static: true}) canvasContainerRef!: ElementRef<HTMLDivElement>;

    private cdr = inject(ChangeDetectorRef);
    private mapItems: MapItemPosition[] = [];

    constructor() {
    }

    public ngAfterViewInit(): void {
    }

    public onDrop(event: CdkDragDrop<any>) {
        console.error("drop");
        if (event.item.element.nativeElement instanceof MapItemComponent) {
            const mapItem = event.item.element.nativeElement as MapItemComponent;
            this.mapItems[mapItem.itemId] = {
                id: mapItem.itemId,
                x: event.dropPoint.x,
                y: event.dropPoint.y
            }
        }
        console.error("drop", this.mapItems);
        this.cdr.markForCheck();
    }

}
