import { Component, inject, Input } from '@angular/core';
import { SummaryState } from '../../../../../pages/hosts/summary_state.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import { JsonPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
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
        TableDirective,
        KeyValuePipe
    ],
    templateUrl: './host-summary.component.html',
    styleUrl: './host-summary.component.css'
})
export class HostSummaryComponent {
    @Input() hostSummaryStat!: SummaryState;
    @Input() selectedNode!: NodeExtended;
    public TranslocoService: TranslocoService = inject(TranslocoService);


    public hostSummaryRowLabels = [
        {
            key: 'state',
            label: this.TranslocoService.translate('State')
        }, {
            key: 'acknowledged',
            label: this.TranslocoService.translate('Acknowledged')
        }, {
            key: 'in_downtime',
            label: this.TranslocoService.translate('In downtime')
        }, {
            key: 'not_handled',
            label: this.TranslocoService.translate('Not handled')
        }, {
            key: 'passive',
            label: this.TranslocoService.translate('Passive')
        }
    ];


}
