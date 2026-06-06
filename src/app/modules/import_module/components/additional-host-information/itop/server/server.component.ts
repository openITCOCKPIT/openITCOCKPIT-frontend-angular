import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../pages/externalsystems/external-systems.interface';
import { FaIconComponent, FaLayersComponent } from '@fortawesome/angular-fontawesome';

import { TableDirective } from '@coreui/angular';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

@Component({
    selector: 'oitc-server',
    imports: [
        FaIconComponent,
        FaLayersComponent,
        TableDirective,
        TranslocoDirective,
        TranslocoPipe
    ],
    templateUrl: './server.component.html',
    styleUrl: './server.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerComponent {
    @Input() result!: AdditionalHostInformationResult;
}
