import { AfterViewInit, ChangeDetectionStrategy, Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { BaseWidgetComponent } from '../../../../pages/dashboards/widgets/base-widget/base-widget.component';
import { SlasSummaryWidgetService } from './slas-summary-widget.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AsyncPipe, NgClass } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    AlertComponent,
    AlertHeadingDirective,
    ColComponent,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent
} from '@coreui/angular';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormsModule } from '@angular/forms';
import { SlasConfig, SlasSummaryWidgetResponse } from '../sla-widget.interface';
import { LabelLinkComponent } from '../../../../layouts/coreui/label-link/label-link.component';
import {
    SlaOverviewMiniEchartComponent
} from '../../components/charts/sla-overview-mini-echart/sla-overview-mini-echart.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-slas-summary-widget',
    imports: [
        FaIconComponent,
        TranslocoDirective,
        RowComponent,
        ColComponent,
        LabelLinkComponent,
        AsyncPipe,
        AlertComponent,
        AlertHeadingDirective,
        XsButtonDirective,
        FormsModule,
        SlaOverviewMiniEchartComponent,
        NgClass,
        RouterLink,
        TranslocoPipe,
        InputGroupComponent,
        InputGroupTextDirective,
        FormControlDirective
    ],
    templateUrl: './slas-summary-widget.component.html',
    styleUrl: './slas-summary-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlasSummaryWidgetComponent extends BaseWidgetComponent implements OnDestroy, AfterViewInit {
    protected flipped = signal<boolean>(false);
    private readonly SlasSummaryWidgetService = inject(SlasSummaryWidgetService);
    public slasSummaryResponse?: SlasSummaryWidgetResponse;
    public config?: SlasConfig;

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
        if (!this.widget || !this.config) {
            return;
        }
        this.subscriptions.add(this.SlasSummaryWidgetService.saveWidgetConfig(this.widget.id, this.config).subscribe((response) => {
            // Close config
            this.flipped.set(false);

            // Reload sla summary widget
            this.load();
        }));
    }
}
