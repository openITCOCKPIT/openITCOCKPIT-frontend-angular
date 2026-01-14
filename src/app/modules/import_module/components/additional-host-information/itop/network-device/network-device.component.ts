import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../pages/externalsystems/external-systems.interface';
import { FaIconComponent, FaLayersComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { TableDirective } from '@coreui/angular';

@Component({
    selector: 'oitc-network-device',
    imports: [
    FaIconComponent,
    TranslocoPipe,
    FaLayersComponent,
    TableDirective,
    TranslocoDirective
],
    templateUrl: './network-device.component.html',
    styleUrl: './network-device.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkDeviceComponent {
    @Input() result!: AdditionalHostInformationResult;
}
