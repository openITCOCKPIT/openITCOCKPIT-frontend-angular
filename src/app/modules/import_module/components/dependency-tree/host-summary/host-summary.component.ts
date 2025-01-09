import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { SummaryState } from '../../../../../pages/hosts/summary_state.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NodeExtended } from '../dependency-tree.component';
import { BadgeComponent, TableDirective } from '@coreui/angular';


@Component({
    selector: 'oitc-host-summary',
    imports: [
    FaIconComponent,
    PermissionDirective,
    RouterLink,
    NgIf,
    TranslocoDirective,
    BadgeComponent,
    NgForOf,
    TableDirective
],
    templateUrl: './host-summary.component.html',
    styleUrl: './host-summary.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostSummaryComponent {
    @Input() hostSummaryStat!: SummaryState;
    @Input() selectedNode!: NodeExtended;
    public TranslocoService: TranslocoService = inject(TranslocoService);

    public hostSummaryRowLabels: { key: keyof SummaryState, label: string, queryParams: {} }[] = [
        {
            key: 'state',
            label: this.TranslocoService.translate('State'),
            queryParams: {}
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
