import { Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../ExternalSystems.interface';

@Component({
  selector: 'oitc-network-device',
  standalone: true,
  imports: [],
  templateUrl: './network-device.component.html',
  styleUrl: './network-device.component.css'
})
export class NetworkDeviceComponent {
    @Input() result!: AdditionalHostInformationResult;

}
