import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    RowComponent
} from '@coreui/angular';
import { PermissionDirective } from '../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import { OutageHost } from '../../downtimereports.interface';
import { KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import {
    ServiceAvailabilityOverviewComponent
} from '../service-availability-overview/service-availability-overview.component';
import {
    HostRadialbarChartComponent
} from '../../../../components/charts/host-radialbar-chart/host-radialbar-chart.component';
import {
    HostSimplePieChartComponent
} from '../../../../components/charts/host-simple-pie-chart/host-simple-pie-chart.component';
import { HostPieChartComponent } from '../../../../components/charts/host-pie-chart/host-pie-chart.component';
import { HostPieEchartComponent } from '../../../../components/charts/host-pie-echart/host-pie-echart.component';

@Component({
    selector: 'oitc-host-availability-overview',
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        PermissionDirective,
        RouterLink,
        CardBodyComponent,
        RowComponent,
        ColComponent,
        NgForOf,
        TranslocoDirective,
        ServiceAvailabilityOverviewComponent,
        NgIf,
        HostRadialbarChartComponent,
        KeyValuePipe,
        HostSimplePieChartComponent,
        HostPieChartComponent,
        HostPieEchartComponent
    ],
    templateUrl: './host-availability-overview.component.html',
    styleUrl: './host-availability-overview.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostAvailabilityOverviewComponent {

    public host = input.required<OutageHost>();

    public dynamicColour = input.required<boolean>();

    public evaluationType = input.required<number>();
    protected readonly eval = eval;
}
