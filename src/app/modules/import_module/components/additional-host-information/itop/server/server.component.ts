import { Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../external-systems.interface';
import { FaIconComponent, FaLayersComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { TableDirective } from '@coreui/angular';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'oitc-server',
  standalone: true,
    imports: [
        FaIconComponent,
        FaLayersComponent,
        NgForOf,
        NgSwitchCase,
        TableDirective,
        TranslocoDirective,
        TranslocoPipe,
        NgSwitch,
        NgIf
    ],
  templateUrl: './server.component.html',
  styleUrl: './server.component.css'
})
export class ServerComponent {
    @Input() result!: AdditionalHostInformationResult;

}
