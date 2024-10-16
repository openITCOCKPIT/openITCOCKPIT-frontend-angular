import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../pages/externalsystems/external-systems.interface';
import { FaIconComponent, FaLayersComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { TableDirective } from '@coreui/angular';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';

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
        NgForOf,
        FaStackItemSizeDirective,
        NgIf
    ],
    templateUrl: './virtual-machine.component.html',
    styleUrl: './virtual-machine.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualMachineComponent {
    @Input() result!: AdditionalHostInformationResult;
}
