import { AfterViewInit, ChangeDetectionStrategy, Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { BaseWidgetComponent } from '../../../../pages/dashboards/widgets/base-widget/base-widget.component';
import { SlaSummaryWidgetService } from './sla-summary-widget.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AsyncPipe, NgIf } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { SlasService } from '../../pages/slas/slas.service';
import {
    AlertComponent,
    AlertHeadingDirective,
    BadgeComponent,
    ColComponent,
    FormLabelDirective,
    RowComponent
} from '@coreui/angular';
import _ from 'lodash';
import { LabelLinkComponent } from '../../../../layouts/coreui/label-link/label-link.component';
import { RouterLink } from '@angular/router';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { FormsModule } from '@angular/forms';
import { SlaConfig, SlaHostsAndServicesWithContainer, SlaSummaryWidgetResponse } from '../sla-widget.interface';

@Component({
    selector: 'oitc-sla-summary-widget',
    imports: [
        FaIconComponent,
        NgIf,
        TranslocoDirective,
        RowComponent,
        ColComponent,
        BadgeComponent,
        LabelLinkComponent,
        AsyncPipe,
        RouterLink,
        AlertComponent,
        AlertHeadingDirective,
        FormLabelDirective,
        SelectComponent,
        XsButtonDirective,
        FormsModule,
        TranslocoPipe
    ],
    templateUrl: './sla-summary-widget.component.html',
    styleUrl: './sla-summary-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlaSummaryWidgetComponent extends BaseWidgetComponent implements OnDestroy, AfterViewInit {
    protected flipped = signal<boolean>(false);
    private readonly SlaSummaryWidgetService = inject(SlaSummaryWidgetService);
    private readonly SlasService = inject(SlasService);
    public slaId: number | null = null;
    public slaResponse?: SlaSummaryWidgetResponse;
    public SlaAvailabilityView?: SlaHostsAndServicesWithContainer[];
    public config?: SlaConfig;
    protected slas: SelectKeyValue[] = [];

    constructor() {
        super();
        effect(() => {
            if (this.flipped()) {
                this.loadSlas();
            }
            this.cdr.markForCheck();
        });
    }


    public override load() {
        if (this.widget) {
            this.subscriptions.add(
                this.SlaSummaryWidgetService.loadWidgetConfig(this.widget.id).subscribe((response) => {
                    this.slaResponse = response;
                    this.SlaAvailabilityView = _.toArray(this.slaResponse.sla.hostsAndServicesOverview);
                    this.config = response.config;
                    this.slaId = this.config.Sla.id;
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

    protected loadSlas = () => {
        this.subscriptions.add(this.SlasService.loadSlas().subscribe((result) => {
            this.slas = result;
            this.cdr.markForCheck();
        }));
    }

    public saveWidgetConfig(): void {
        if (!this.widget || !this.slaId) {
            return;
        }
        this.subscriptions.add(this.SlaSummaryWidgetService.saveWidgetConfig(this.widget.id, this.slaId).subscribe((response) => {
            // Close config
            this.flipped.set(false);

            // Reload sla summary widget
            this.load();
        }));
    }
}
