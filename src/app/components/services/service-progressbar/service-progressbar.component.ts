import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { ColComponent, Colors, ProgressComponent, ProgressStackedComponent, RowComponent } from '@coreui/angular';
import { ChartAbsolutValue } from '../../charts/charts.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ServiceProgressbarGauge } from './service-progressbar.interface';
import { getDefaultAutomapsViewParams } from '../../../pages/automaps/automaps.interface';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'oitc-service-progressbar',
    standalone: true,
    imports: [
        RowComponent,
        ColComponent,
        ProgressStackedComponent,
        ProgressComponent,
        FaIconComponent,
        NgClass,
        NgIf
    ],
    templateUrl: './service-progressbar.component.html',
    styleUrl: './service-progressbar.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceProgressbarComponent {
    public progressbarData = input<ChartAbsolutValue[]>([]);
    public showPercentage = input<boolean>(true);
    public values: ServiceProgressbarGauge[] = [];

    private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    constructor() {
        effect(() => {
            this.values = this.getValues();
            this.cdr.markForCheck();
        });
    }

    private getValues(): ServiceProgressbarGauge[] {
        const data = this.progressbarData();
        const colors: Colors[] = ["success", "warning", "danger", "secondary", "info", "primary", "dark", "light", "white", "transparent"];

        const values: ServiceProgressbarGauge[] = [];
        for (let i = 0; i < data.length; i++) {
            values.push({
                name: data[i].Name,
                color: colors[i % colors.length], // By using the modulo operator (%), the code ensures that the color index wraps around if there are more data items than colors. This way, the colors are reused cyclically.
                percentage: data[i].Value / data[i].Total * 100
            });
        }

        return values;
    }

    protected readonly getDefaultAutomapsViewParams = getDefaultAutomapsViewParams;
}
