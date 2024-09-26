import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    inject,
    Input,
    OnChanges,
    SimpleChanges,
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
    standalone: true,
    imports: [],
    templateUrl: './vectormap.component.html',
    styleUrl: './vectormap.component.css'
})
export class VectormapComponent implements AfterViewInit, OnChanges {

    // Creates a VectorMap using https://github.com/themustafaomar/jsvectormap

    @ViewChild('map')
    private mapRef!: ElementRef<HTMLDivElement>;


    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        this.updateMapSize();
    }

    @Input() public height: number = 300;
    @Input() public markers: VectormapMarker[] = [];

    private map: any;

    private readonly TranslocoService = inject(TranslocoService);

    ngAfterViewInit(): void {

        const unknownMarker = this.TranslocoService.translate('Please enter a name');

        this.map = new jsVectorMap({
            selector: this.mapRef.nativeElement,
            showTooltip: true,
            markers: this.markers,
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

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.map && changes['markers']) {

            this.map.removeMarkers();

            const newMarkers = changes['markers'].currentValue;
            if (newMarkers.length === 1) {
                this.map.setFocus({
                    coords: newMarkers[0].coords,
                    scale: 7,
                    animate: true
                });
            }

            this.map.addMarkers(newMarkers);
        }
    }

    private updateMapSize(): void {
        if (this.map) {
            this.map.updateSize();
        }
    }

}
