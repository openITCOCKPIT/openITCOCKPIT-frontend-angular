
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, ViewChild } from '@angular/core';

import { NgIf, NgFor, TitleCasePipe } from '@angular/common';
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective } from '@jsverse/transloco';
import { SkeletonModule } from 'primeng/skeleton';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';
import { HoststatusIconComponent } from '../../../../../pages/hosts/hoststatus-icon/hoststatus-icon.component';
import {
    ServicestatusIconComponent
} from '../../../../../components/services/servicestatus-icon/servicestatus-icon.component';
import { TrustAsHtmlPipe } from '../../../../../pipes/trust-as-html.pipe';
import { ToasterLoaderComponent } from '../../../../../layouts/primeng/loading/toaster-loader/toaster-loader.component';
import {OpenstreetmapAcls} from '../../openstreetmap.interface';
import { OpenstreetmapToasterService } from './openstreetmap-toaster.service';

@Component({
  selector: 'oitc-openstreetmap-toaster',
  imports: [
      NgIf,
      NgFor,
      ProgressBarComponent,
      ProgressComponent,
      ToastBodyComponent,
      ToastComponent,
      ToastHeaderComponent,
      ToasterComponent,
      FaIconComponent,
      TranslocoDirective,
      SkeletonModule,
      ToasterLoaderComponent,
      RowComponent,
      ColComponent,
      LabelLinkComponent,
      HoststatusIconComponent,
      TitleCasePipe,
      ServicestatusIconComponent,
      TrustAsHtmlPipe
  ],
  templateUrl: './openstreetmap-toaster.component.html',
  styleUrl: './openstreetmap-toaster.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenstreetmapToasterComponent {
    public toastVisible: boolean = false;
    public toastPercentage: number = 0;

    @ViewChild(ToastComponent) private toast!: ToastComponent;

    public summary?: any;
    public acls?: any;

    private cdr = inject(ChangeDetectorRef);
    private readonly OpenstreetmapToasterService: OpenstreetmapToasterService= inject(OpenstreetmapToasterService);
    private subscriptions: Subscription = new Subscription();

    constructor() {
        this.subscriptions.add(this.OpenstreetmapToasterService.rights$.subscribe((rights: OpenstreetmapAcls) => {
            this.acls = rights;
            this.cdr.markForCheck();
           // console.log(rights);
        }));
        this.subscriptions.add(this.OpenstreetmapToasterService.containerIds$.subscribe((containerIds: number[]) => {
            this.summary = undefined;
            this.cdr.markForCheck();

            if (containerIds.length > 0) {
                this.subscriptions.add(this.OpenstreetmapToasterService.loadOpenstreetMapSumaryState(containerIds).subscribe((data: any) => {
                    this.summary = Object.values(data.summary);
                    this.toastVisible = true;

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
