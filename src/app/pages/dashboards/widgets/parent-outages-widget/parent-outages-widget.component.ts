import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    ColComponent,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { DashboardsService } from '../../dashboards.service';
import { ParentOutage } from '../../dashboards.interface';
import { HoststatusIconComponent } from '../../../hosts/hoststatus-icon/hoststatus-icon.component';
import { NgIf } from '@angular/common';
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
        LabelLinkComponent,
        NgIf,
        RowComponent,
        ColComponent
    ],
    templateUrl: './parent-outages-widget.component.html',
    styleUrl: './parent-outages-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParentOutagesWidgetComponent extends BaseWidgetComponent {
    public hostname: string = '';
    public readonly DashboardsService: DashboardsService = inject(DashboardsService);
    public parentOutages: ParentOutage[] = [];

    public showNoOuttagesText: boolean = true;

    public override load() {
        if (this.widget) {
            this.parentOutages = [];
            this.subscriptions.add(this.DashboardsService.getParentOutagesWidget(this.hostname)
                .subscribe((result) => {
                    this.parentOutages = result.parent_outages;
                    this.showNoOuttagesText = true;

                    if (this.hostname !== '' || this.parentOutages.length > 0) {
                        this.showNoOuttagesText = false;
                    }

                    this.cdr.markForCheck();
                }));
        }
    }

    public onFilterChange($event: any) {
        this.cdr.markForCheck();
        this.load();
    }
}
