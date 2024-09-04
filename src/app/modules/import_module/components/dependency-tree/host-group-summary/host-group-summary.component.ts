import { Component, inject, Input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import { JsonPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { BadgeComponent, TableDirective } from '@coreui/angular';
import { HostgroupSummaryState, SummaryState } from '../../../../../pages/hosts/summary_state.interface';
import { NodeExtended } from '../dependency-tree.component';

@Component({
  selector: 'oitc-host-group-summary',
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
  templateUrl: './host-group-summary.component.html',
  styleUrl: './host-group-summary.component.css'
})
export class HostGroupSummaryComponent {
    @Input() hostgroupSummeryState!: HostgroupSummaryState;
    @Input() selectedNode!: NodeExtended;
    public TranslocoService: TranslocoService = inject(TranslocoService);

    public hostSummaryRowLabels: { key: keyof SummaryState, label: string, queryParams: {} }[] = [
        {
            key: 'state',
            label: this.TranslocoService.translate('State'),
            queryParams: {
            }
        }, {
            key: 'acknowledged',
            label: this.TranslocoService.translate('Acknowledged'),
            queryParams: {
                'acknowledged': true,

            }
        }, {
            key: 'in_downtime',
            label: this.TranslocoService.translate('In downtime'),
            queryParams: {
                'in_downtime': true
            }
        }, {
            key: 'not_handled',
            label: this.TranslocoService.translate('Not handled'),
            queryParams: {
                'not_acknowledged': true,
                'not_in_downtime': true
            }
        }, {
            key: 'passive',
            label: this.TranslocoService.translate('Passive'),
            queryParams: {
                'passive': true
            }
        }
    ];
    protected readonly Object = Object;
}
