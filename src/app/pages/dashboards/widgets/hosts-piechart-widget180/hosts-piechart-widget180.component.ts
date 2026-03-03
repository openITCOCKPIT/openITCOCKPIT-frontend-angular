import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HostPieChartComponent } from '../../../../components/charts/host-pie-chart/host-pie-chart.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { StatuscountResponse } from '../../../browsers/browsers.interface';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { RouterLink } from '@angular/router';
import { BlockLoaderComponent } from '../../../../layouts/primeng/loading/block-loader/block-loader.component';

@Component({
    selector: 'oitc-hosts-piechart-widget180',
    imports: [
        AsyncPipe,
        FaIconComponent,
        HostPieChartComponent,
        TranslocoDirective,
        RouterLink,
        BlockLoaderComponent
    ],
    templateUrl: './hosts-piechart-widget180.component.html',
    styleUrl: './hosts-piechart-widget180.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostsPiechartWidget180Component extends BaseWidgetComponent {
    public statusCounts?: StatuscountResponse;

    public triggerChartUpdate: number = 0;

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
        // This will trigger the input of the chart component to update
        this.triggerChartUpdate++;
        this.cdr.markForCheck();
    }

    public override layoutUpdate(event: KtdGridLayout) {
    }
}
