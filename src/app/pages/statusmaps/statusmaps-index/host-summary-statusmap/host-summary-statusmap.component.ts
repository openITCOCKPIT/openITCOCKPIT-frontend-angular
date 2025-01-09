import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { SummaryState } from '../../../hosts/summary_state.interface';
import { BadgeComponent, TableDirective } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf } from '@angular/common';
import { PermissionDirective } from '../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { HostEntity } from '../../../hosts/hosts.interface';

@Component({
    selector: 'oitc-host-summary-statusmap',
    imports: [
    BadgeComponent,
    FaIconComponent,
    NgForOf,
    PermissionDirective,
    TableDirective,
    TranslocoDirective,
    RouterLink
],
    templateUrl: './host-summary-statusmap.component.html',
    styleUrl: './host-summary-statusmap.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostSummaryStatusmapComponent {
    @Input() hostSummaryStat!: SummaryState;
    @Input() host!: HostEntity;
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
