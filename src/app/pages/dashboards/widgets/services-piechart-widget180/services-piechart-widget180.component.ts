import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { AsyncPipe, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ServicePieChartComponent } from '../../../../components/charts/service-pie-chart/service-pie-chart.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { StatuscountResponse } from '../../../browsers/browsers.interface';

@Component({
    selector: 'oitc-services-piechart-widget180',
    imports: [
        AsyncPipe,
        FaIconComponent,
        NgIf,
        ServicePieChartComponent,
        TranslocoDirective,
        RouterLink
    ],
    templateUrl: './services-piechart-widget180.component.html',
    styleUrl: './services-piechart-widget180.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesPiechartWidget180Component extends BaseWidgetComponent {
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
        super.resizeWidget(event);
    }

    public override layoutUpdate(event: KtdGridLayout) {
        super.layoutUpdate(event);
    }
}
