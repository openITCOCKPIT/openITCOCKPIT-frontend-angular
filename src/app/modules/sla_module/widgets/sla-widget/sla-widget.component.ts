import { AfterViewInit, ChangeDetectionStrategy, Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { BaseWidgetComponent } from '../../../../pages/dashboards/widgets/base-widget/base-widget.component';
import { SlaWidgetService } from './sla-widget.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AsyncPipe, NgClass } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { SlasService } from '../../pages/slas/slas.service';
import { AlertComponent, AlertHeadingDirective, ColComponent, FormLabelDirective, RowComponent } from '@coreui/angular';
import { LabelLinkComponent } from '../../../../layouts/coreui/label-link/label-link.component';
import { RouterLink } from '@angular/router';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { FormsModule } from '@angular/forms';
import { SlaConfig, SlaHostsAndServices, SlaWidgetResponse } from '../sla-widget.interface';

@Component({
    selector: 'oitc-sla-widget',
    imports: [
    FaIconComponent,
    TranslocoDirective,
    RowComponent,
    ColComponent,
    LabelLinkComponent,
    AsyncPipe,
    AlertComponent,
    AlertHeadingDirective,
    FormLabelDirective,
    SelectComponent,
    XsButtonDirective,
    FormsModule,
    TranslocoPipe,
    NgClass,
    RouterLink
],
    templateUrl: './sla-widget.component.html',
    styleUrl: './sla-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlaWidgetComponent extends BaseWidgetComponent implements OnDestroy, AfterViewInit {
    protected flipped = signal<boolean>(false);
    private readonly SlaWidgetService = inject(SlaWidgetService);
    private readonly SlasService = inject(SlasService);
    public slaId: number | null = null;
    public slaResponse?: SlaWidgetResponse;
    public SlaAvailabilityView?: SlaHostsAndServices;
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

    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    public override load() {
        if (this.widget) {
            this.subscriptions.add(
                this.SlaWidgetService.loadWidgetConfig(this.widget.id).subscribe((response) => {
                    this.slaResponse = response;
                    this.SlaAvailabilityView = response.sla.hostsAndServicesOverview;
                    this.config = response.config;
                    this.slaId = this.config.Sla.id;
                    this.cdr.markForCheck();
                })
            );
        }
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
        this.subscriptions.add(this.SlaWidgetService.saveWidgetConfig(this.widget.id, this.slaId).subscribe((response) => {
            // Close config
            this.flipped.set(false);

            // Reload sla widget
            this.load();
        }));
    }
}
