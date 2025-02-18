import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    input,
    InputSignal,
    ViewChild
} from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { Helplines } from './map-canvas.interface';
import { MapItemType } from '../map-item-base/map-item-base.enum';

@Component({
    selector: 'oitc-map-canvas',
    standalone: true,
    imports: [
        NgClass,
        NgIf
    ],
    templateUrl: './map-canvas.component.html',
    styleUrl: './map-canvas.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapCanvasComponent {
    @ViewChild('mapCanvasContainer', {static: true}) canvasContainerRef!: ElementRef<HTMLDivElement>;

    private cdr = inject(ChangeDetectorRef);

    public helplines = input<Helplines>({enabled: true, size: 15});
    public background = input<string | null>('');
    public isViewMode: InputSignal<boolean> = input<boolean>(true);
    public currentDeletedItem: InputSignal<{ id: number, type: MapItemType } | undefined> = input<{
        id: number,
        type: MapItemType
    }>();

    constructor() {
    }

    public getHelplinesClass(): string {
        if (this.helplines().enabled) {
            return 'helplines' + this.helplines().size;
        }
        return '';
    };

}
