import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { AsyncPipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ServicePieChartComponent } from '../../../../components/charts/service-pie-chart/service-pie-chart.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { StatuscountResponse } from '../../../browsers/browsers.interface';
import { BlockLoaderComponent } from '../../../../layouts/primeng/loading/block-loader/block-loader.component';

@Component({
    selector: 'oitc-services-piechart-widget180',
    imports: [
    AsyncPipe,
    FaIconComponent,
    ServicePieChartComponent,
    TranslocoDirective,
    RouterLink,
    BlockLoaderComponent
],
    templateUrl: './services-piechart-widget180.component.html',
    styleUrl: './services-piechart-widget180.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesPiechartWidget180Component extends BaseWidgetComponent {
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
