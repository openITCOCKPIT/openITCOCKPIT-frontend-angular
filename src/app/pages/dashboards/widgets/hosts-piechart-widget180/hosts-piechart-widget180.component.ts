import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HostPieChartComponent } from '../../../../components/charts/host-pie-chart/host-pie-chart.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { StatuscountResponse } from '../../../browsers/browsers.interface';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-hosts-piechart-widget180',
    imports: [
        AsyncPipe,
        FaIconComponent,
        HostPieChartComponent,
        NgIf,
        TranslocoDirective,
        RouterLink
    ],
    templateUrl: './hosts-piechart-widget180.component.html',
    styleUrl: './hosts-piechart-widget180.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostsPiechartWidget180Component extends BaseWidgetComponent {
    public statusCounts?: StatuscountResponse;

    public override load() {
        this.subscriptions.add(this.WidgetsService.loadStatusCount()
            .subscribe((result) => {
                this.statusCounts = result;
                this.cdr.markForCheck();
            })
        );
    }

    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    public override resizeWidget(event?: KtdResizeEnd) {
 
    }

    public override layoutUpdate(event: KtdGridLayout) {
        super.layoutUpdate(event);
    }
}
