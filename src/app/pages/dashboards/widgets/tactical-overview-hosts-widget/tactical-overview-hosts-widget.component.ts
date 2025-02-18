import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AsyncPipe, NgIf } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { DashboardsService } from '../../dashboards.service';
import { HostgroupSummaryStateHosts } from '../../../hosts/summary_state.interface';
import { getTacticalOverviewHostsFilter, TacticalOverviewHostsFilter } from '../../dashboards.interface';
import { HostgroupsLoadHostgroupsByStringParams } from '../../../hostgroups/hostgroups.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { HostgroupsService } from '../../../hostgroups/hostgroups.service';
import { RouterLink } from '@angular/router';
import {
    ColComponent,
    FormCheckInputDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent
} from '@coreui/angular';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    RegexHelperTooltipComponent
} from '../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MultiSelectComponent } from '../../../../layouts/primeng/multi-select/multi-select/multi-select.component';

@Component({
    selector: 'oitc-tactical-overview-hosts-widget',
    imports: [
        FaIconComponent,
        NgIf,
        TranslocoDirective,
        AsyncPipe,
        RouterLink,
        ColComponent,
        DebounceDirective,
        FormCheckInputDirective,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        ReactiveFormsModule,
        RegexHelperTooltipComponent,
        RowComponent,
        TranslocoPipe,
        FormsModule,
        NgSelectComponent,
        MultiSelectComponent
    ],
    templateUrl: './tactical-overview-hosts-widget.component.html',
    styleUrl: './tactical-overview-hosts-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TacticalOverviewHostsWidgetComponent extends BaseWidgetComponent {
    protected flipped = signal<boolean>(false);
    public readonly DashboardsService: DashboardsService = inject(DashboardsService);
    public readonly HostgroupsService: HostgroupsService = inject(HostgroupsService);
    public hoststatusSummary?: HostgroupSummaryStateHosts;
    public filter: TacticalOverviewHostsFilter = getTacticalOverviewHostsFilter();
    protected hostgroups: SelectKeyValue[] = [];
    public keywords: string[] = [];
    public notKeywords: string[] = [];


    public override load() {
        if (this.widget) {
            this.subscriptions.add(this.DashboardsService.getTacticalOverviewWidget(this.widget, 'hosts')
                .subscribe((result) => {
                    this.filter.Host = result.config.Host;
                    this.keywords = this.filter.Host.keywords.split(',');
                    this.notKeywords = this.filter.Host.not_keywords.split(',');
                    console.log(this.notKeywords);
                    this.filter.Hostgroup._ids = result.config.Hostgroup._ids;
                    this.hoststatusSummary = result.hoststatusSummary;
                    this.cdr.markForCheck();
                }));
            this.loadHostgroups('');
        }
    }

    protected loadHostgroups = (search: string) => {
        this.subscriptions.add(this.HostgroupsService.loadHostgroupsByString({'filter[Containers.name]': search} as HostgroupsLoadHostgroupsByStringParams).subscribe((data: SelectKeyValue[]) => {
            this.hostgroups = data;
            this.cdr.markForCheck();
        }));
    }

    public onFilterChange($event: any) {
        this.cdr.markForCheck();
        this.load();
    }
}
