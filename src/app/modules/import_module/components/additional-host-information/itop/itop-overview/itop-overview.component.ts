import { Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../ExternalSystems.interface';

@Component({
    selector: 'oitc-itop-overview',
    standalone: true,
    imports: [],
    templateUrl: './itop-overview.component.html',
    styleUrl: './itop-overview.component.css'
})
export class ItopOverviewComponent {

    @Input() public result!: AdditionalHostInformationResult;
}
