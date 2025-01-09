import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    ElementRef,
    HostListener,
    inject,
    input,
    ViewChild
} from '@angular/core';

// Could not find a declaration file for module 'jsvectormap'
// @ts-ignore
import jsVectorMap from "jsvectormap";
import "jsvectormap/dist/maps/world.js";
import "jsvectormap/dist/jsvectormap.css";
import { VectormapMarker } from './vactormap.interface';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'oitc-vectormap',
    imports: [],
    templateUrl: './vectormap.component.html',
    styleUrl: './vectormap.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VectormapComponent implements AfterViewInit {

    // Creates a VectorMap using https://github.com/themustafaomar/jsvectormap

    @ViewChild('map')
    private mapRef!: ElementRef<HTMLDivElement>;


    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        this.updateMapSize();
    }

    public height = input<number>(300);
    public markers = input<VectormapMarker[]>([]);

    private map: any;

    private readonly TranslocoService = inject(TranslocoService);

    private cdr = inject(ChangeDetectorRef);

    constructor() {
        effect(() => {

            // Update markers
            this.map.removeMarkers();
            const newMarkers = this.markers()
            if (newMarkers.length === 1) {
                this.map.setFocus({
                    coords: newMarkers[0].coords,
                    scale: 7,
                    animate: true
                });
            }
            this.map.addMarkers(newMarkers);

        });
    }

    ngAfterViewInit(): void {

        const unknownMarker = this.TranslocoService.translate('Please enter a name');

        this.map = new jsVectorMap({
            selector: this.mapRef.nativeElement,
            showTooltip: true,
            markers: this.markers(),
            labels: {
                markers: {
                    // Starting from jsvectormap v1.2 the render function receives
                    // the marker object as a first parameter and index as the second.
                    render(marker: VectormapMarker, index: number) {
                        return marker.name || unknownMarker
                    }
                }
            },
            // Found the focusOn in this issue: https://github.com/themustafaomar/jsvectormap/issues/129#issuecomment-1565301083
            //focusOn: {
            //    coords: [50, 9],
            //    scale: 7,
            //    animate: true,
            //},
        });

    }

    private updateMapSize(): void {
        if (this.map) {
            this.map.updateSize();
        }
    }

}
