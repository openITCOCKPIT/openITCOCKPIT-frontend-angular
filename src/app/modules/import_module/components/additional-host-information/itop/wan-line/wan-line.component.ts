import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../pages/externalsystems/external-systems.interface';
import { FaIconComponent, FaLayersComponent } from '@fortawesome/angular-fontawesome';
import { TableDirective } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
    selector: 'oitc-wan-line',
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
    styleUrl: './wan-line.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WanLineComponent {
    @Input() result!: AdditionalHostInformationResult;
}
