import { Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../ExternalSystems.interface';
import { TranslocoDirective } from '@jsverse/transloco';
import { TableDirective } from '@coreui/angular';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import {
    FaIconComponent,
    FaLayersComponent,
    FaStackComponent,
    FaStackItemSizeDirective
} from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-default',
    standalone: true,
    imports: [
        TranslocoDirective,
        TableDirective,
        NgIf,
        NgSwitch,
        FaIconComponent,
        NgSwitchCase,
        FaStackComponent,
        FaStackItemSizeDirective,
        FaLayersComponent
    ],
    templateUrl: './default.component.html',
    styleUrl: './default.component.css'
})
export class DefaultComponent {
    @Input() result!: AdditionalHostInformationResult;

}
