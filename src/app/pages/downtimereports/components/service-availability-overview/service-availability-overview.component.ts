import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ServiceObject } from '../../downtimereports.interface';
import { TranslocoDirective } from '@jsverse/transloco';
import { ColComponent, RowComponent } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import {
    HostRadialbarChartComponent
} from '../../../../components/charts/host-radialbar-chart/host-radialbar-chart.component';

@Component({
    selector: 'oitc-service-availability-overview',
    imports: [
        TranslocoDirective,
        ColComponent,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        RowComponent,
        HostRadialbarChartComponent
    ],
    templateUrl: './service-availability-overview.component.html',
    styleUrl: './service-availability-overview.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceAvailabilityOverviewComponent {


    public service = input.required<ServiceObject>();

    public dynamicColour = input.required<boolean>();
}
