import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { AsyncPipe, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HostPieChartComponent } from '../../../../components/charts/host-pie-chart/host-pie-chart.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { PermissionsService } from '../../../../permissions/permissions.service';
import { StatuscountResponse } from '../../../browsers/browsers.interface';

@Component({
    selector: 'oitc-hosts-piechart-widget',
    imports: [
        AsyncPipe,
        FaIconComponent,
        HostPieChartComponent,
        NgIf,
        TranslocoDirective,
        RouterLink
    ],
    templateUrl: './hosts-piechart-widget.component.html',
    styleUrl: './hosts-piechart-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostsPiechartWidgetComponent extends BaseWidgetComponent {

    public statusCounts?: StatuscountResponse;

    public readonly PermissionsService = inject(PermissionsService);


    public override load() {
        super.load();
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
