import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { HostStatusOverviewWidgetConfig } from './host-status-overview-widget.interface';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { HostStatusOverviewWidgetService } from './host-status-overview-widget.service';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';

@Component({
    selector: 'oitc-host-status-overview-widget',
    imports: [],
    templateUrl: './host-status-overview-widget.component.html',
    styleUrl: './host-status-overview-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostStatusOverviewWidgetComponent extends BaseWidgetComponent {
    protected flipped = signal<boolean>(false);
    public config?: HostStatusOverviewWidgetConfig;
    private readonly HostStatusOverviewWidgetService = inject(HostStatusOverviewWidgetService);
    private readonly notyService = inject(NotyService);
    public statusCount: string | number = 0;


    public override load() {
        if (this.widget) {
            this.subscriptions.add(this.HostStatusOverviewWidgetService.getHostStatusOverviewWidget(this.widget)
                .subscribe((result) => {
                    this.config = result.config;
                    this.statusCount = result.statusCount;

                    this.cdr.markForCheck();
                }));
        }
    }


    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    public override resizeWidget(event?: KtdResizeEnd) {
    }

    public override layoutUpdate(event: KtdGridLayout) {
    }
}
