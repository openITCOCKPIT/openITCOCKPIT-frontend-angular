import { Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../ExternalSystems.interface';
import { FaIconComponent, FaLayersComponent } from '@fortawesome/angular-fontawesome';
import { TableDirective } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { JsonPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { CustomClassInformationComponent } from './custom-class-information/custom-class-information.component';


@Component({
    selector: 'oitc-custom-class',
    standalone: true,
    imports: [
        FaIconComponent,
        FaLayersComponent,
        TableDirective,
        TranslocoDirective,
        NgIf,
        NgForOf,
        KeyValuePipe,
        JsonPipe,
        CustomClassInformationComponent
    ],
    templateUrl: './custom-class.component.html',
    styleUrl: './custom-class.component.css'
})
export class CustomClassComponent {
    @Input() result!: AdditionalHostInformationResult;
}
