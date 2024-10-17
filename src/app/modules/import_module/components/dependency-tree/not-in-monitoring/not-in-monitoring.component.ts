import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { BadgeComponent, TableDirective } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { NodeExtended } from '../dependency-tree.component';
import { SystemnameService } from '../../../../../services/systemname.service';

@Component({
    selector: 'oitc-not-in-monitoring',
    standalone: true,
    imports: [
        BadgeComponent,
        FaIconComponent,
        NgForOf,
        NgIf,
        PermissionDirective,
        TableDirective,
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
