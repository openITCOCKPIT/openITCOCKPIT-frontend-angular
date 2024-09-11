import { Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../external-systems.interface';
import { FaIconComponent, FaLayersComponent } from '@fortawesome/angular-fontawesome';
import { TableDirective } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
  selector: 'oitc-wan-line',
  standalone: true,
    imports: [
        FaIconComponent,
        FaLayersComponent,
        TableDirective,
        TranslocoDirective,
        NgSwitchCase,
        NgSwitch,
        NgIf
    ],
  templateUrl: './wan-line.component.html',
  styleUrl: './wan-line.component.css'
})
export class WanLineComponent {
    @Input() result!: AdditionalHostInformationResult;

}
