import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ExternalSystemsService } from '../../pages/externalsystems/external-systems.service';
import { AdditionalHostInformationResult } from '../../pages/externalsystems/external-systems.interface';
import { TranslocoDirective } from '@jsverse/transloco';
import { TableLoaderComponent } from '../../../../layouts/primeng/loading/table-loader/table-loader.component';

import { IdoitOverviewComponent } from './idoit/idoit-overview/idoit-overview.component';
import { ItopOverviewComponent } from './itop/itop-overview/itop-overview.component';

@Component({
    selector: 'oitc-additional-host-information',
    imports: [
        TranslocoDirective,
        TableLoaderComponent,
        IdoitOverviewComponent,
        ItopOverviewComponent
    ],
    templateUrl: './additional-host-information.component.html',
    styleUrl: './additional-host-information.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdditionalHostInformationComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public hostId: number = 0;
    @Input() public hostname: string = '';
    @Input() lastUpdated?: Date; // Change the date to trigger an update from an external component

    public result?: AdditionalHostInformationResult;

    private subscriptions: Subscription = new Subscription();

    private readonly ExternalSystemsService = inject(ExternalSystemsService);

    private cdr = inject(ChangeDetectorRef);

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
                this.cdr.markForCheck();
            })
        );
    }


}
