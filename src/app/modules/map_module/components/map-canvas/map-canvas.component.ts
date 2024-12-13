import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    effect,
    ElementRef,
    inject,
    input,
    QueryList,
    ViewChild
} from '@angular/core';
import { MapItemComponent } from '../map-item/map-item.component';
import { NgClass } from '@angular/common';
import { Helplines } from './map-canvas.interface';

@Component({
    selector: 'oitc-map-canvas',
    standalone: true,
    imports: [
        NgClass
    ],
    templateUrl: './map-canvas.component.html',
    styleUrl: './map-canvas.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapCanvasComponent implements AfterViewInit, AfterContentInit {
    @ViewChild('mapCanvasContainer', {static: true}) canvasContainerRef!: ElementRef<HTMLDivElement>;

    private cdr = inject(ChangeDetectorRef);

    public helplines = input<Helplines>({enabled: true, size: 15});
    public gridSize = input<{ x: number, y: number }>({x: 25, y: 25}); // Grid size for snapping
    public gridEnabled = input<boolean>(true);
    public isViewMode = input<boolean>(false);

    @ContentChildren(MapItemComponent) mapItemChildrens!: QueryList<MapItemComponent>;

    constructor() {
        effect(() => {
            this.updateValuesForChildren()
        });
    }

    public ngAfterViewInit(): void {
    }

    public ngAfterContentInit(): void {
        this.updateValuesForChildren()
    }

    private updateValuesForChildren(): void {
        if (this.mapItemChildrens) {
            this.mapItemChildrens.forEach(child => {
                child.gridEnabled = this.gridEnabled();
                child.gridSize = this.gridSize();
                child.isViewMode = this.isViewMode();
            });
        }
        this.cdr.markForCheck();
    }

    public getHelplinesClass(): string {
        if (this.helplines().enabled) {
            return 'helplines' + this.helplines().size;
        }
        return '';
    };

}
