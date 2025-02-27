import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, ViewChild } from '@angular/core';

import { NgForOf, NgIf } from '@angular/common';
import {
    ColComponent,
    ProgressBarComponent,
    ProgressComponent,
    RowComponent,
    ToastBodyComponent,
    ToastComponent,
    ToasterComponent,
    ToastHeaderComponent
} from '@coreui/angular';
import { Subscription } from 'rxjs';
import { MapSummaryToasterService } from './map-summary-toaster.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';


import { TranslocoDirective } from '@jsverse/transloco';
import { SkeletonModule } from 'primeng/skeleton';
import { ToasterLoaderComponent } from '../../../../layouts/primeng/loading/toaster-loader/toaster-loader.component';
import { MapSummaryRoot, Summary } from '../../pages/mapeditors/mapeditors.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TrustAsHtmlPipe } from '../../../../pipes/trust-as-html.pipe';

@Component({
    selector: 'oitc-map-summary-toaster',
    imports: [
        NgIf,
        NgForOf,
        ProgressBarComponent,
        ProgressComponent,
        ToastBodyComponent,
        ToastComponent,
        ToasterComponent,
        FaIconComponent,
        TranslocoDirective,
        SkeletonModule,
        ToasterLoaderComponent,
        RowComponent,
        ColComponent,
        RouterLink,
        TrustAsHtmlPipe,
        ToastHeaderComponent
    ],
    templateUrl: './map-summary-toaster.component.html',
    styleUrl: './map-summary-toaster.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapSummaryToasterComponent implements OnDestroy {

    public toastVisible: boolean = false;
    public toastPercentage: number = 0;

    private cdr = inject(ChangeDetectorRef);
    private readonly MapSummaryToasterService: MapSummaryToasterService = inject(MapSummaryToasterService);
    private subscriptions: Subscription = new Subscription();

    @ViewChild(ToastComponent) private toast!: ToastComponent;
    protected summaryState?: Summary;
    protected iconType: string = "";

    constructor(private sanitizer: DomSanitizer) {
        this.subscriptions.add(this.MapSummaryToasterService.itemObservable$.subscribe(({
                                                                                            item,
                                                                                            summary
                                                                                        }) => {
            this.cdr.markForCheck();

            if (item) {
                // Load the map summary from the service and show the toast.
                this.subscriptions.add(this.MapSummaryToasterService.getMapsummary(item, summary).subscribe((data: MapSummaryRoot) => {
                    this.toastVisible = true;
                    this.summaryState = data.summary;
                    this.iconType = item.type;

                    // Reset the toast timer when the item changes.
                    // (user hovers over a different service)
                    if (this.toast) {
                        this.toast.clearTimer();
                        this.toast.setTimer();
                    }

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
