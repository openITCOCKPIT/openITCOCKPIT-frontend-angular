import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    signal,
    ViewChild
} from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { AnimationEvent } from '@angular/animations';
import { ColComponent, FormLabelDirective, RowComponent } from '@coreui/angular';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    OrganizationalchartsByStringParams,
    OrganizationalchartWidgetConfig
} from './organizationalchart-widget.interface';
import { OrganizationalchartWidgetService } from './organizationalchart-widget.service';
import { OrganizationalChartsService } from '../../../organizationalcharts/organizationalcharts.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';

import { IntervalPickerComponent } from '../../../../components/interval-picker/interval-picker.component';
import { OrganizationalChartsPost } from '../../../organizationalcharts/organizationalcharts.interface';
import {
    OrganizationalChartsViewerComponent
} from '../../../organizationalcharts/organizational-charts-viewer/organizational-charts-viewer.component';

@Component({
    selector: 'oitc-organizationalchart-widget',
    imports: [
        FormLabelDirective,
        SelectComponent,
        RequiredIconComponent,
        XsButtonDirective,
        FaIconComponent,
        TranslocoDirective,
        FormsModule,
        ColComponent,
        RowComponent,
        IntervalPickerComponent,
        OrganizationalChartsViewerComponent
    ],
    templateUrl: './organizationalchart-widget.component.html',
    styleUrl: './organizationalchart-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationalchartWidgetComponent extends BaseWidgetComponent implements AfterViewInit {
    protected flipped = signal<boolean>(false);
    @ViewChild('boxContainer') boxContainer?: ElementRef;
    public widgetHeight: number = 0;

    // widget config will be loaded from the server
    public config?: OrganizationalchartWidgetConfig;

    public organizationalChart?: OrganizationalChartsPost;
    public organizationalCharts: SelectKeyValue[] = [];

    protected selectedAutoRefresh: SelectKeyValue = {key: 0, value: 'Disabled'};
    private refreshInterval: any = null;

    private readonly OrganizationalchartWidgetService = inject(OrganizationalchartWidgetService);
    private readonly OrganizationalChartsService: OrganizationalChartsService = inject(OrganizationalChartsService);


    public override load(): void {
        if (this.widget) {
            this.OrganizationalchartWidgetService.loadWidgetConfig(this.widget.id).subscribe((response) => {
                this.config = response;
                if (this.config.organizationalchart_id) {
                    this.config.organizationalchart_id = Number(this.config.organizationalchart_id);
                    this.loadOrganizationalChart();
                }
                this.selectedAutoRefresh.key = this.config.refresh_key ?? 0;
                this.cdr.markForCheck();
            });
        }
    }

    public loadOrganizationalcharts = (searchString: string): void => {
        const selected: number[] = [];
        if (this.config?.organizationalchart_id) {
            selected.push(Number(this.config.organizationalchart_id));
        }

        const params: OrganizationalchartsByStringParams = {
            angular: true,
            'filter[OrganizationalCharts.name]': searchString,
            'selected[]': selected
        }

        this.subscriptions.add(this.OrganizationalchartWidgetService.loadOrganizationalchartsByString(params)
            .subscribe((result) => {
                this.organizationalCharts = result;
                this.cdr.markForCheck();
            })
        );
    };

    public ngAfterViewInit(): void {
    }

    public override onAnimationStart(event: AnimationEvent) {
        if (event.toState && this.organizationalCharts.length === 0) {
            // "true" means show config.
            this.loadOrganizationalcharts('');
        }

        super.onAnimationStart(event);
    }

    public saveConfig(): void {
        if (this.config && this.widget) {
            this.OrganizationalchartWidgetService.saveWidgetConfig(this.widget.id, this.config).subscribe((response) => {
                // Update the markdown content
                this.load();
                // Close config
                this.flipped.set(false);
            });
        }
    }


    public override ngOnDestroy(): void {
        this.stopRefreshInterval();
        super.ngOnDestroy();
    }

    public onRefreshChange = (value?: SelectKeyValue): void => {
        if (value) {
            this.selectedAutoRefresh = value;
            if (this.config) {
                this.config.refresh_key = this.selectedAutoRefresh.key;
                this.saveConfig();
            }

        }
        this.stopRefreshInterval();
        if (this.selectedAutoRefresh.key > 0) {
            this.startRefreshInterval(this.selectedAutoRefresh.key);
        }
    }

    private startRefreshInterval(interval: number) {
        this.stopRefreshInterval();
        this.refreshInterval = setInterval(() => {
            this.refresh();
        }, interval * 1000);
    }

    protected refresh(): void {
        if (this.config?.organizationalchart_id) {
            this.loadOrganizationalChart();
            this.cdr.markForCheck();

        }
    }

    private stopRefreshInterval() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        this.refreshInterval = null;
    }

    public override resizeWidget(event?: KtdResizeEnd): void {
    }

    public override layoutUpdate(event: KtdGridLayout): void {
    }

    public loadOrganizationalChart() {
        if (this.config) {
            this.subscriptions.add(this.OrganizationalChartsService.getOrganizationalChartById(this.config.organizationalchart_id as number)
                .subscribe((result) => {
                    this.organizationalChart = result.organizationalChart;

                    this.cdr.markForCheck();
                    return;
                }));
        }

    }

    protected readonly Number = Number;
}
