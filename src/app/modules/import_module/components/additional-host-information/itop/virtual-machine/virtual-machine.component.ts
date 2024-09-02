import { Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../ExternalSystems.interface';
import { FaIconComponent, FaLayersComponent } from '@fortawesome/angular-fontawesome';
import { TableDirective } from '@coreui/angular';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { NgForOf, NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
  selector: 'oitc-virtual-machine',
  standalone: true,
    imports: [
        FaIconComponent,
        FaLayersComponent,
        TableDirective,
        TranslocoDirective,
        NgSwitchCase,
        NgSwitch,
        TranslocoPipe,
        NgForOf
    ],
  templateUrl: './virtual-machine.component.html',
  styleUrl: './virtual-machine.component.css'
})
export class VirtualMachineComponent {
    @Input() result!: AdditionalHostInformationResult;

}
