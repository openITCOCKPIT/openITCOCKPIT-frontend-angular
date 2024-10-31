import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    ElementRef,
    inject,
    input,
    ViewChild
} from '@angular/core';
import { simplePie } from "simple-pie";
import { PieChartMetric } from '../charts.interface';
import { TranslocoService } from '@jsverse/transloco';

export interface SimplePieGauge {
    value: number,
    name: string,
    color: string
}

@Component({
    selector: 'oitc-host-simple-pie-chart',
    standalone: true,
    imports: [],
    templateUrl: './host-simple-pie-chart.component.html',
    styleUrl: './host-simple-pie-chart.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostSimplePieChartComponent implements AfterViewInit {
    @ViewChild('simplePieContainer', {static: true}) simplePieContainer!: ElementRef<HTMLDivElement>;

    public width = input<number>(300);
    public pieData = input<PieChartMetric[]>([]);
    private readonly TranslocoService = inject(TranslocoService);


    public headline: string = '';
    public values: SimplePieGauge[] = [];

    private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    constructor() {
        // If we use the transloco component in the template we need to wait until Transloco is ready.
        // So i use the service here to get the translation.
        this.headline = this.TranslocoService.translate('Host availability');
        effect(() => {
            this.values = this.getValues();
            this.renderPie();
            this.cdr.markForCheck();
        });
    }

    public ngAfterViewInit(): void {
        this.renderPie();
    }

    private getValues(): SimplePieGauge[] {
        const data = this.pieData();
        const colors = ["#00bc4c", "#bf0000", "#6b737c"];

        const values: SimplePieGauge[] = [];
        for (let i = 0; i < data.length; i++) {
            values.push({
                value: data[i].value,
                name: data[i].name,
                color: colors[i % colors.length] // By using the modulo operator (%), the code ensures that the color index wraps around if there are more data items than colors. This way, the colors are reused cyclically.
            });
        }

        return values;
    }


    private renderPie() {
        if (!this.simplePieContainer) {
            return;
        }

        // Clear the container
        this.simplePieContainer.nativeElement.innerHTML = '';

        const data = this.values.map((v) => v.value);
        if (data.length === 0) {
            return;
        }

        const svgPie = simplePie(data, {
            pallet: ["#00bc4c", "#bf0000", "#6b737c"],
            borderColor: "transparent"
        });
        this.simplePieContainer.nativeElement.appendChild(svgPie);
    }

}
