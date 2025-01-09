import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AsyncPipe, NgIf } from '@angular/common';

import { TranslocoDirective } from '@jsverse/transloco';
import { NodeExtended } from '../dependency-tree.component';
import { SystemnameService } from '../../../../../services/systemname.service';

@Component({
    selector: 'oitc-not-in-monitoring',
    imports: [
    FaIconComponent,
    NgIf,
    TranslocoDirective,
    AsyncPipe
],
    templateUrl: './not-in-monitoring.component.html',
    styleUrl: './not-in-monitoring.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotInMonitoringComponent {
    @Input() selectedNode!: NodeExtended;

    public readonly SystemnameService = inject(SystemnameService);
}
