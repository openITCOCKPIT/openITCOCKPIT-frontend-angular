import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormControlDirective, InputGroupComponent, InputGroupTextDirective } from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { getDefaultHostsIndexFilter, HostsIndexFilter } from '../../../hosts/hosts.interface';
import { DashboardsService } from '../../dashboards.service';
import { ParentOutage } from '../../dashboards.interface';
import { HoststatusIconComponent } from '../../../hosts/hoststatus-icon/hoststatus-icon.component';
import { NgForOf } from '@angular/common';
import { LabelLinkComponent } from '../../../../layouts/coreui/label-link/label-link.component';

@Component({
    selector: 'oitc-parent-outages-widget',
    imports: [
        DebounceDirective,
        FaIconComponent,
        FormControlDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        TranslocoPipe,
        TranslocoDirective,
        HoststatusIconComponent,
        NgForOf,
        LabelLinkComponent
    ],
    templateUrl: './parent-outages-widget.component.html',
    styleUrl: './parent-outages-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParentOutagesWidgetComponent extends BaseWidgetComponent {
    public filter: HostsIndexFilter = getDefaultHostsIndexFilter();
    public readonly DashboardsService: DashboardsService = inject(DashboardsService);
    public parentOutages: ParentOutage[] = [];

    public override load() {
        if (this.widget) {
            this.subscriptions.add(this.DashboardsService.getParentOutagesWidget(this.filter['Hosts.name'])
                .subscribe((result) => {
                    this.parentOutages = result.parent_outages;
                    this.cdr.markForCheck();
                }));
        }
        this.cdr.markForCheck();
    }

    public onFilterChange($event: any) {
        this.load();
    }
}
