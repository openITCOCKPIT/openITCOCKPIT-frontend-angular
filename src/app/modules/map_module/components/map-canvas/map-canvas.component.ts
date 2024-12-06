import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    inject,
    Input,
    OnChanges,
    QueryList,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { MapItemComponent } from '../map-item/map-item.component';

@Component({
    selector: 'oitc-map-canvas',
    standalone: true,
    imports: [],
    templateUrl: './map-canvas.component.html',
    styleUrl: './map-canvas.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapCanvasComponent implements AfterViewInit, AfterContentInit, OnChanges {
    @ViewChild('mapCanvasContainer', {static: true}) canvasContainerRef!: ElementRef<HTMLDivElement>;

    private cdr = inject(ChangeDetectorRef);

    @Input({required: true}) gridSize: { x: number, y: number } = {x: 25, y: 25}; // Grid size for snapping
    @Input({required: true}) gridEnabled: boolean = true;

    @ContentChildren(MapItemComponent) mapItemChildrens!: QueryList<MapItemComponent>;

    constructor() {
    }

    public ngAfterViewInit(): void {
    }

    public ngAfterContentInit(): void {
        this.updateValuesForChildren()
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['gridSize'] || changes['gridEnabled']) {
            this.updateValuesForChildren()
        }
    }

    private updateValuesForChildren(): void {
        if (this.mapItemChildrens) {
            this.mapItemChildrens.forEach(child => {
                child.gridEnabled = this.gridEnabled;
                child.gridSize = this.gridSize;
            });
        }
    }

}
