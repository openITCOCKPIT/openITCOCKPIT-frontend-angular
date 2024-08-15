import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { SatellitesService } from '../../pages/satellites/satellites.service';
import { SatelliteEntityCake2 } from '../../pages/satellites/satellites.interface';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'oitc-satellite-name',
    standalone: true,
    imports: [
        NgIf,
        SkeletonModule
    ],
    templateUrl: './satellite-name.component.html',
    styleUrl: './satellite-name.component.css'
})
export class SatelliteNameComponent implements OnInit, OnDestroy, OnChanges {

    @Input() satelliteId: number = 0;
    public satellite?: SatelliteEntityCake2;

    private subscriptions: Subscription = new Subscription();
    private readonly SatellitesService = inject(SatellitesService);

    public ngOnInit() {
        //this.load();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['satelliteId']) {
            this.load();
        }
    }

    public load() {
        this.subscriptions.add(
            this.SatellitesService.getSatelliteById(this.satelliteId).subscribe((data) => {
                this.satellite = data
            })
        );
    }

}
