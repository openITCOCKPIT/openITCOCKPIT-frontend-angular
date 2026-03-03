import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { SatellitesService } from '../../pages/satellites/satellites.service';
import { SatelliteEntityCake2 } from '../../pages/satellites/satellites.interface';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-satellite-name',
    imports: [
        SkeletonModule,
        TranslocoDirective,
        FaIconComponent
    ],
    templateUrl: './satellite-name.component.html',
    styleUrl: './satellite-name.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SatelliteNameComponent implements OnDestroy {

    public satelliteId = input<number>(0);

    public satellite?: SatelliteEntityCake2;
    public restrictedSatellite: boolean = false;

    private subscriptions: Subscription = new Subscription();
    private readonly SatellitesService = inject(SatellitesService);
    private cdr = inject(ChangeDetectorRef);

    constructor() {
        effect(() => {
            this.load();
        });
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public load() {
        this.subscriptions.add(
            this.SatellitesService.getSatelliteById(this.satelliteId()).subscribe((data) => {
                if (!data.hasOwnProperty('error') && !data.hasOwnProperty('status')) {
                    this.satellite = data as SatelliteEntityCake2;
                }

                if (data.hasOwnProperty('error') && data.hasOwnProperty('status')) {
                    if (data.status === 403) {
                        // We have no permission to view this satellite
                        // Probably we can only see this host through host sharing, or it is in the ROOT_CONTAINER
                        this.restrictedSatellite = true;
                    }
                }

                this.cdr.markForCheck();
            })
        );
    }

}
