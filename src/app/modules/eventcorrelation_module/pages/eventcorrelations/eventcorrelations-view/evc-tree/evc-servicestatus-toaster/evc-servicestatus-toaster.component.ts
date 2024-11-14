import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import {
    HostSummaryStatusmapComponent
} from '../../../../../../../pages/statusmaps/statusmaps-index/host-summary-statusmap/host-summary-statusmap.component';
import { NgIf } from '@angular/common';
import {
    ProgressBarComponent,
    ProgressComponent,
    ToastBodyComponent,
    ToastComponent,
    ToasterComponent,
    ToastHeaderComponent
} from '@coreui/angular';
import { Subscription } from 'rxjs';
import { EvcServicestatusToasterService } from './evc-servicestatus-toaster.service';

@Component({
    selector: 'oitc-evc-servicestatus-toaster',
    standalone: true,
    imports: [
        HostSummaryStatusmapComponent,
        NgIf,
        ProgressBarComponent,
        ProgressComponent,
        ToastBodyComponent,
        ToastComponent,
        ToastHeaderComponent,
        ToasterComponent
    ],
    templateUrl: './evc-servicestatus-toaster.component.html',
    styleUrl: './evc-servicestatus-toaster.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvcServicestatusToasterComponent implements OnDestroy {

    public toastVisible: boolean = false;
    public toastPercentage: number = 0;

    private cdr = inject(ChangeDetectorRef);
    private readonly EvcServicestatusToasterService: EvcServicestatusToasterService = inject(EvcServicestatusToasterService);
    private subscriptions: Subscription = new Subscription();

    constructor() {
        this.subscriptions.add(this.EvcServicestatusToasterService.serviceId$.subscribe((serviceId: number) => {
            console.log('serviceId', serviceId);
            if (serviceId > 0) {
                // Load the service status details from the service and show the toast.
                this.subscriptions.add(this.EvcServicestatusToasterService.getServicestatus(serviceId).subscribe((data) => {
                    this.toastVisible = true;
                    this.cdr.markForCheck();
                }));
            }
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onToastTimerChange($event: number) {
        this.toastPercentage = $event * 25;
    }

    public onToastVisibleChange($event: boolean) {
        this.toastVisible = $event;
        if (!this.toastVisible) {
            this.toastPercentage = 0;
        }
    }

}
