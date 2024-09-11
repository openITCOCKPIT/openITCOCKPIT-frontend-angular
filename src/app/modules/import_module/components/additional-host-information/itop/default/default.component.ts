import { Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../external-systems.interface';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { TableDirective } from '@coreui/angular';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import {
    FaIconComponent,
    FaLayersComponent,
    FaLayersTextComponent,
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
        FaLayersComponent,
        FaLayersTextComponent,
        TranslocoPipe
    ],
    templateUrl: './default.component.html',
    styleUrl: './default.component.css'
})
export class DefaultComponent {
    @Input() result!: AdditionalHostInformationResult;

}
