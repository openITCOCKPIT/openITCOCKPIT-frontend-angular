import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { AreaEchartsComponent } from '../../../../../components/charts/area-echarts/area-echarts.component';
import { CardBodyComponent, CardComponent, ColComponent, RowComponent } from '@coreui/angular';
import { Subscription } from 'rxjs';
import { ProxmoxService } from '../proxmox.service';
import { ProxmoxGraphDataParams, ProxmoxGraphDataResult, ProxmoxVirtType } from '../proxmox-api.interface';
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
    public virtType = input<ProxmoxVirtType>(ProxmoxVirtType.Qemu);

    public metrics?: ProxmoxGraphDataResult;

    private subscriptions: Subscription = new Subscription();

    private readonly ProxmoxService = inject(ProxmoxService);

    private cdr = inject(ChangeDetectorRef);

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
            type: this.virtType(),
            debug: 'false',
            cf: 'AVERAGE',
            isoTimestamp: 1,
            jsTimestamp: 0,
            timeframe: 'hour'
        };

        this.subscriptions.add(this.ProxmoxService.getGraphData(this.hostId(), params).subscribe(response => {
            this.metrics = response;
            this.cdr.markForCheck();
        }));
    }
}
