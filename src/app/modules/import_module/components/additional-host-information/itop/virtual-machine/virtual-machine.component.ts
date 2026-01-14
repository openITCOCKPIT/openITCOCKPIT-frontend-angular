import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../pages/externalsystems/external-systems.interface';
import { FaIconComponent, FaLayersComponent } from '@fortawesome/angular-fontawesome';
import { TableDirective } from '@coreui/angular';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';


@Component({
    selector: 'oitc-virtual-machine',
    imports: [
    FaIconComponent,
    FaLayersComponent,
    TableDirective,
    TranslocoDirective,
    TranslocoPipe
],
    templateUrl: './virtual-machine.component.html',
    styleUrl: './virtual-machine.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualMachineComponent {
    @Input() result!: AdditionalHostInformationResult;
}
