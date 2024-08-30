import { Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../ExternalSystems.interface';

@Component({
    selector: 'oitc-idoit-overview',
    standalone: true,
    imports: [],
    templateUrl: './idoit-overview.component.html',
    styleUrl: './idoit-overview.component.css'
})
export class IdoitOverviewComponent {

    @Input() public result!: AdditionalHostInformationResult;

}
