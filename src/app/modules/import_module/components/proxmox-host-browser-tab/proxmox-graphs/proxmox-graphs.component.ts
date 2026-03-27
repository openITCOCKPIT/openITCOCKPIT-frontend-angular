import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { AreaEchartsComponent } from '../../../../../components/charts/area-echarts/area-echarts.component';
import { CardBodyComponent, CardComponent, ColComponent, RowComponent } from '@coreui/angular';
import { Subscription } from 'rxjs';
import { ProxmoxService } from '../proxmox.service';
import { ProxmoxGraphDataParams, ProxmoxGraphDataResult } from '../proxmox-api.interface';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'oitc-proxmox-graphs',
    imports: [
        AreaEchartsComponent,
        CardBodyComponent,
        CardComponent,
        ColComponent,
        RowComponent,
        TranslocoDirective
    ],
    templateUrl: './proxmox-graphs.component.html',
    styleUrl: './proxmox-graphs.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProxmoxGraphsComponent implements OnDestroy {

    public hostId = input<number>(0);
    public vmid = input<string>('');
    public nodeName = input<string>('');

    public metrics?: ProxmoxGraphDataResult;

    private subscriptions: Subscription = new Subscription();

    private readonly ProxmoxService = inject(ProxmoxService);

    private cdr = inject(ChangeDetectorRef);

    public cpuUsage = {
        "2026-03-27T08:05:22+01:00": 0.003999999999999974,
        "2026-03-27T08:06:05+01:00": 0.041499999999999974,
        "2026-03-27T08:06:48+01:00": 0.05616666666666662,
        "2026-03-27T08:07:31+01:00": 0.046666666666666676,
        "2026-03-27T08:08:14+01:00": 0.010000000000000024,
        "2026-03-27T08:08:57+01:00": 0.07599999999999998,
        "2026-03-27T08:09:40+01:00": 0.07550000000000003

    };

    public constructor() {
        effect(() => {
            // initialize effect to trigger on input changes
            this.hostId();
            this.vmid()
            this.nodeName()

            this.loadGraphData();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadGraphData(): void {
        if (!this.hostId() || !this.vmid() || !this.nodeName()) {
            return;
        }

        let params: ProxmoxGraphDataParams = {
            vmid: this.vmid(),
            node: this.nodeName(),
            type: 'qemu',
            debug: 'false',
            cf: 'AVERAGE',
            isoTimestamp: 1,
            jsTimestamp: 0,
            timeframe: 'hour'
        };

        this.subscriptions.add(this.ProxmoxService.getGraphData(this.hostId(), params).subscribe(response => {
            console.log(response);
            this.metrics = response;
            this.cdr.markForCheck();
        }));
    }
}
