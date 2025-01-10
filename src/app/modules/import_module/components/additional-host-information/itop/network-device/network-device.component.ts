import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../pages/externalsystems/external-systems.interface';
import { FaIconComponent, FaLayersComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { TableDirective } from '@coreui/angular';

@Component({
    selector: 'oitc-network-device',
    imports: [
        FaIconComponent,
        TranslocoPipe,
        NgSwitch,
        FaLayersComponent,
        NgSwitchCase,
        NgIf,
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
