import { Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../ExternalSystems.interface';

@Component({
  selector: 'oitc-server',
  standalone: true,
  imports: [],
  templateUrl: './server.component.html',
  styleUrl: './server.component.css'
})
export class ServerComponent {
    @Input() result!: AdditionalHostInformationResult;

}
