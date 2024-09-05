import { Component, OnInit } from '@angular/core';
import { UUID } from '../../../classes/UUID';

@Component({
    selector: 'oitc-host-pie-chart',
    standalone: true,
    imports: [],
    templateUrl: './host-pie-chart.component.html',
    styleUrl: './host-pie-chart.component.css'
})
export class HostPieChartComponent implements OnInit {

    public chartId!: string;

    public ngOnInit() {
        const uuid = new UUID();
        this.chartId = 'hostPieChart-' + uuid.v4();
    }

    public renderChart() {

    }

}
