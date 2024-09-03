import { Component, Input } from '@angular/core';
import { SummaryState } from '../../../../../pages/hosts/summary_state.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { NodeExtended } from '../dependency-tree.component';
import { BadgeComponent, TableDirective } from '@coreui/angular';

@Component({
    selector: 'oitc-host-summary',
    standalone: true,
    imports: [
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        NgIf,
        TranslocoDirective,
        JsonPipe,
        BadgeComponent,
        NgForOf,
        TableDirective
    ],
    templateUrl: './host-summary.component.html',
    styleUrl: './host-summary.component.css'
})
export class HostSummaryComponent {
    @Input() hostSummaryStat!: SummaryState;
    @Input() selectedNode!: NodeExtended;

}
