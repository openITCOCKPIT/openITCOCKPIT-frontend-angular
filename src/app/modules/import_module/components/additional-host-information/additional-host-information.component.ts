import { Component, inject, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExternalSystemsService } from '../../external-systems.service';
import { AdditionalHostInformationResult } from '../../ExternalSystems.interface';
import { TranslocoDirective } from '@jsverse/transloco';
import { TableLoaderComponent } from '../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NgIf } from '@angular/common';
import { IdoitOverviewComponent } from './idoit/idoit-overview/idoit-overview.component';
import { ItopOverviewComponent } from './itop/itop-overview/itop-overview.component';

interface InOnit {
}

@Component({
    selector: 'oitc-additional-host-information',
    standalone: true,
    imports: [
        TranslocoDirective,
        TableLoaderComponent,
        NgIf,
        IdoitOverviewComponent,
        ItopOverviewComponent
    ],
    templateUrl: './additional-host-information.component.html',
    styleUrl: './additional-host-information.component.css'
})
export class AdditionalHostInformationComponent implements InOnit, OnChanges, OnDestroy {

    @Input() public hostId: number = 0;
    @Input() public hostname: string = '';
    @Input() lastUpdated?: Date; // Change the date to trigger an update from an external component

    public result?: AdditionalHostInformationResult;

    private subscriptions: Subscription = new Subscription();

    private readonly ExternalSystemsService = inject(ExternalSystemsService);

    public ngOnInit(): void {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['hostId']) {
            this.load();
            return;
        }

        // Parent component wants to trigger an update
        if (changes['lastUpdated'] && !changes['lastUpdated'].isFirstChange()) {
            //this.load();
            return;
        }

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.subscriptions.add(this.ExternalSystemsService.getAdditionalHostInformation(this.hostId)
            .subscribe((result) => {
                this.result = result;
            })
        );
    }


}
