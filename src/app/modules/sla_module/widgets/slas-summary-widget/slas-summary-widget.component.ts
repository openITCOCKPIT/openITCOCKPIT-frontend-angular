import { AfterViewInit, ChangeDetectionStrategy, Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { BaseWidgetComponent } from '../../../../pages/dashboards/widgets/base-widget/base-widget.component';
import { SlasSummaryWidgetService } from './slas-summary-widget.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AsyncPipe } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { SlasService } from '../../pages/slas/slas.service';
import { AlertComponent, AlertHeadingDirective, ColComponent, RowComponent } from '@coreui/angular';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormsModule } from '@angular/forms';
import { SlaConfig, SlaHostsAndServicesWithContainer, SlasSummaryWidgetResponse } from '../sla-widget.interface';

@Component({
    selector: 'oitc-slas-summary-widget',
    imports: [
        FaIconComponent,
        TranslocoDirective,
        RowComponent,
        ColComponent,
        AsyncPipe,
        AlertComponent,
        AlertHeadingDirective,
        XsButtonDirective,
        FormsModule,
        TranslocoPipe
    ],
    templateUrl: './slas-summary-widget.component.html',
    styleUrl: './slas-summary-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlasSummaryWidgetComponent extends BaseWidgetComponent implements OnDestroy, AfterViewInit {
    protected flipped = signal<boolean>(false);
    private readonly SlasSummaryWidgetService = inject(SlasSummaryWidgetService);
    private readonly SlasService = inject(SlasService);
    public slasSummaryResponse?: SlasSummaryWidgetResponse;
    public SlaAvailabilityView?: SlaHostsAndServicesWithContainer[];
    public config?: SlaConfig;

    constructor() {
        super();
        effect(() => {
            if (this.flipped()) {
                this.load();
            }
            this.cdr.markForCheck();
        });
    }


    public override load() {
        if (this.widget) {
            this.subscriptions.add(
                this.SlasSummaryWidgetService.loadWidgetConfig(this.widget.id).subscribe((response) => {
                    this.slasSummaryResponse = response;
                    //this.SlaAvailabilityView = _.toArray(this.slaResponse.sla.hostsAndServicesOverview);
                    this.config = response.config;
                    this.cdr.markForCheck();
                })
            );
        }
    }

    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    public ngAfterViewInit() {
    }


    public saveWidgetConfig(): void {
        if (!this.widget) {
            return;
        }
        this.subscriptions.add(this.SlasSummaryWidgetService.saveWidgetConfig(this.widget.id).subscribe((response) => {
            // Close config
            this.flipped.set(false);

            // Reload sla summary widget
            this.load();
        }));
    }
}
