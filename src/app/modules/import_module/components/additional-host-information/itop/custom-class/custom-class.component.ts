import { Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../ExternalSystems.interface';

@Component({
  selector: 'oitc-custom-class',
  standalone: true,
  imports: [],
  templateUrl: './custom-class.component.html',
  styleUrl: './custom-class.component.css'
})
export class CustomClassComponent {
    @Input() result!: AdditionalHostInformationResult;

}
