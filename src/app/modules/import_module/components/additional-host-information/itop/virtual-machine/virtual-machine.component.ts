import { Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../ExternalSystems.interface';

@Component({
  selector: 'oitc-virtual-machine',
  standalone: true,
  imports: [],
  templateUrl: './virtual-machine.component.html',
  styleUrl: './virtual-machine.component.css'
})
export class VirtualMachineComponent {
    @Input() result!: AdditionalHostInformationResult;

}
