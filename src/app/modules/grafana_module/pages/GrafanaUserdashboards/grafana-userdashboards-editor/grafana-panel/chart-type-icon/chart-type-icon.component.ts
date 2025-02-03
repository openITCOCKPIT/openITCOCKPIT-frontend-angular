import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { GrafanaChartTypesEnum } from './GrafanaChartTypes.enum';

@Component({
    selector: 'oitc-chart-type-icon',
    imports: [
        FaIconComponent
    ],
    templateUrl: './chart-type-icon.component.html',
    styleUrl: './chart-type-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartTypeIconComponent {

    chartType = input<GrafanaChartTypesEnum>(GrafanaChartTypesEnum.timeseries);


    protected readonly GrafanaChartTypesEnum = GrafanaChartTypesEnum;
}
