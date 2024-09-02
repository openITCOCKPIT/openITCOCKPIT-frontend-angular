import { Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../ExternalSystems.interface';

@Component({
  selector: 'oitc-wan-line',
  standalone: true,
  imports: [],
  templateUrl: './wan-line.component.html',
  styleUrl: './wan-line.component.css'
})
export class WanLineComponent {
    @Input() result!: AdditionalHostInformationResult;

}
