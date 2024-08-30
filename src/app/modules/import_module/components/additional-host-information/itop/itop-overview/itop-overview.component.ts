import { Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../ExternalSystems.interface';
import { ColComponent, RowComponent } from '@coreui/angular';
import { OnlineOfflineComponent } from '../../online-offline/online-offline.component';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'oitc-itop-overview',
    standalone: true,
    imports: [
        ColComponent,
        OnlineOfflineComponent,
        RowComponent,
        TranslocoDirective
    ],
    templateUrl: './itop-overview.component.html',
    styleUrl: './itop-overview.component.css'
})
export class ItopOverviewComponent {

    @Input() public result!: AdditionalHostInformationResult;
}
