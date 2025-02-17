import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ServiceObject } from '../../downtimereports.interface';
import { TranslocoDirective } from '@jsverse/transloco';
import { ColComponent, RowComponent } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import { ServicePieChartComponent } from '../../../../components/charts/service-pie-chart/service-pie-chart.component';
import { NgStyle } from '@angular/common';
import { AvailabilityColorCalculationService } from '../../AvailabilityColorCalculationService';

@Component({
    selector: 'oitc-service-availability-overview',
    imports: [
        TranslocoDirective,
        ColComponent,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        RowComponent,
        ServicePieChartComponent,
        NgStyle
    ],
    templateUrl: './service-availability-overview.component.html',
    styleUrl: './service-availability-overview.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceAvailabilityOverviewComponent {

    protected  readonly  AvailabilityColorCalculationService : AvailabilityColorCalculationService = inject(AvailabilityColorCalculationService);

    public service = input.required<ServiceObject>();

    public dynamicColour = input.required<boolean>();
}
