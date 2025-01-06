import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, ViewChild } from '@angular/core';
import {
    HostSummaryStatusmapComponent
} from '../../../../../../../pages/statusmaps/statusmaps-index/host-summary-statusmap/host-summary-statusmap.component';
import { NgIf, TitleCasePipe } from '@angular/common';
import {
    ColComponent,
    ProgressBarComponent,
    ProgressComponent,
    RowComponent,
    TableDirective,
    ToastBodyComponent,
    ToastComponent,
    ToasterComponent,
    ToastHeaderComponent
} from '@coreui/angular';
import { Subscription } from 'rxjs';
import { EvcServicestatusToasterService } from './evc-servicestatus-toaster.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { SkeletonModule } from 'primeng/skeleton';
import {
    ToasterLoaderComponent
} from '../../../../../../../layouts/primeng/loading/toaster-loader/toaster-loader.component';
import { EvcServicestatusToast } from '../../../eventcorrelations.interface';
import { LabelLinkComponent } from '../../../../../../../layouts/coreui/label-link/label-link.component';
import { RequiredIconComponent } from '../../../../../../../components/required-icon/required-icon.component';
import { HoststatusIconComponent } from '../../../../../../../pages/hosts/hoststatus-icon/hoststatus-icon.component';
import {
    ServicestatusIconComponent
} from '../../../../../../../components/services/servicestatus-icon/servicestatus-icon.component';
import { TrustAsHtmlPipe } from '../../../../../../../pipes/trust-as-html.pipe';

@Component({
    selector: 'oitc-evc-servicestatus-toaster',
    imports: [
        HostSummaryStatusmapComponent,
        NgIf,
        ProgressBarComponent,
        ProgressComponent,
        ToastBodyComponent,
        ToastComponent,
        ToastHeaderComponent,
        ToasterComponent,
        TableDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        TranslocoDirective,
        SkeletonModule,
        ToasterLoaderComponent,
        RowComponent,
        ColComponent,
        LabelLinkComponent,
        RequiredIconComponent,
        HoststatusIconComponent,
        TitleCasePipe,
        ServicestatusIconComponent,
        TrustAsHtmlPipe
    ],
    templateUrl: './evc-servicestatus-toaster.component.html',
    styleUrl: './evc-servicestatus-toaster.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvcServicestatusToasterComponent implements OnDestroy {

    public toastVisible: boolean = false;
    public toastPercentage: number = 0;

    public result?: EvcServicestatusToast;

    private cdr = inject(ChangeDetectorRef);
    private readonly EvcServicestatusToasterService: EvcServicestatusToasterService = inject(EvcServicestatusToasterService);
    private subscriptions: Subscription = new Subscription();

    @ViewChild(ToastComponent) private toast!: ToastComponent;

    constructor() {
        this.subscriptions.add(this.EvcServicestatusToasterService.serviceId$.subscribe((serviceId: number) => {
            this.result = undefined;
            this.cdr.markForCheck();

            if (serviceId > 0) {
                // Load the service status details from the service and show the toast.
                this.subscriptions.add(this.EvcServicestatusToasterService.getServicestatus(serviceId).subscribe((data: EvcServicestatusToast) => {
                    this.toastVisible = true;
                    this.result = data;

                    // Reset the toast timer when the service id changes.
                    // (user hovers over a different service)
                    this.toast.clearTimer();
                    this.toast.setTimer();

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

    protected readonly String = String;
}
