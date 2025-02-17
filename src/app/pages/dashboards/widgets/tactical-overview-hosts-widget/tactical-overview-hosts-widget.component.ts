import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DashboardsService } from '../../dashboards.service';
import { HostgroupSummaryStateHosts } from '../../../hosts/summary_state.interface';
import { getTacticalOverviewHostsFilter, TacticalOverviewHostsFilter } from '../../dashboards.interface';
import { HostgroupsLoadHostgroupsByStringParams } from '../../../hostgroups/hostgroups.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { HostgroupsService } from '../../../hostgroups/hostgroups.service';

@Component({
    selector: 'oitc-tactical-overview-hosts-widget',
    imports: [
        FaIconComponent,
        NgIf,
        TranslocoDirective
    ],
    templateUrl: './tactical-overview-hosts-widget.component.html',
    styleUrl: './tactical-overview-hosts-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('flip', [
            state('false', style({transform: 'none'})),
            state('true', style({transform: 'rotateY(180deg)'})),
            transition('false <=> true', animate('0.8s ease-in-out'))
        ])
    ]
})
export class TacticalOverviewHostsWidgetComponent extends BaseWidgetComponent {
    protected flipped = signal<boolean>(false);
    public readonly DashboardsService: DashboardsService = inject(DashboardsService);
    public readonly HostgroupsService: HostgroupsService = inject(HostgroupsService);
    public hoststatusSummary?: HostgroupSummaryStateHosts;
    public filter: TacticalOverviewHostsFilter = getTacticalOverviewHostsFilter();
    protected hostgroups: SelectKeyValue[] = [];


    public override load() {
        if (this.widget) {
            this.subscriptions.add(this.DashboardsService.getTacticalOverviewWidget(this.widget, 'hosts')
                .subscribe((result) => {
                    this.filter.Host = result.config.Host;
                    this.filter.Hostgroup._ids = result.config.Hostgroup._ids;
                    this.hoststatusSummary = result.hoststatusSummary;
                    console.log(this.hoststatusSummary);
                    console.log(this.filter);
                    this.cdr.markForCheck();
                }));
            this.loadHostgroups();
        }
    }

    public loadHostgroups() {
        this.subscriptions.add(this.HostgroupsService.loadHostgroupsByString({} as HostgroupsLoadHostgroupsByStringParams).subscribe((data: SelectKeyValue[]) => {
            this.hostgroups = data;
            this.cdr.markForCheck();
        }));
    }
}
