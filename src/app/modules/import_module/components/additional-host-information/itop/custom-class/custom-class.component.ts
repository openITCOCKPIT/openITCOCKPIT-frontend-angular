import { Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../ExternalSystems.interface';
import { FaIconComponent, FaLayersComponent } from '@fortawesome/angular-fontawesome';
import { TableDirective } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgIf } from '@angular/common';

@Component({
    selector: 'oitc-custom-class',
    standalone: true,
    imports: [
        FaIconComponent,
        FaLayersComponent,
        TableDirective,
        TranslocoDirective,
        NgIf
    ],
    templateUrl: './custom-class.component.html',
    styleUrl: './custom-class.component.css'
})
export class CustomClassComponent {
    @Input() result!: AdditionalHostInformationResult;

}
