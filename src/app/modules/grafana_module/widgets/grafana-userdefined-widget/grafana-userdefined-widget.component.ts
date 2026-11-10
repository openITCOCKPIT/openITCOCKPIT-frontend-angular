import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    signal,
    ViewChild
} from '@angular/core';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { AnimationEvent } from '@angular/animations';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { distinctUntilChanged, skip } from 'rxjs';
import { LayoutService } from '../../../../layouts/coreui/layout.service';
import { GrafanaUserdefinedWidgetService } from './grafana-userdefined-widget.service';
import { BaseWidgetComponent } from '../../../../pages/dashboards/widgets/base-widget/base-widget.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormLabelDirective } from '@coreui/angular';
import { IframeComponent } from '../../../../components/iframe/iframe.component';

import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-grafana-userdefined-widget',
    imports: [
        FaIconComponent,
        FormLabelDirective,
        IframeComponent,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective
    ],
    templateUrl: './grafana-userdefined-widget.component.html',
    styleUrl: './grafana-userdefined-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrafanaUserdefinedWidgetComponent extends BaseWidgetComponent implements AfterViewInit {
    protected flipped = signal<boolean>(false);
    @ViewChild('boxContainer') boxContainer?: ElementRef;
    public widgetHeight: number = 0;

    public grafana_userdashboard_id: null | number = null;
    public iframe_url: string = '';

    public grafanaDashboards: SelectKeyValue[] = [];

    private readonly GrafanaUserdefinedWidgetService = inject(GrafanaUserdefinedWidgetService);
    private readonly LayoutService = inject(LayoutService);

    public constructor() {
        super();

        // Reload the iframe url, if the user switches the theme (light / dark)
        this.subscriptions.add(this.LayoutService.theme$.pipe(skip(1), distinctUntilChanged()).subscribe(() => {
            this.load();
        }));
    }

    public override load() {
        if (this.widget) {
            this.GrafanaUserdefinedWidgetService.loadWidgetConfig(this.widget.id, this.LayoutService.getTheme()).subscribe((response) => {
                this.grafana_userdashboard_id = response.grafana_userdashboard_id;
                this.iframe_url = response.iframe_url;
                this.cdr.markForCheck();
            });
        }
    }

    public ngAfterViewInit(): void {
        this.calcIframeHeight();
    }

    public override onAnimationStart(event: AnimationEvent) {
        if (event.toState && this.grafanaDashboards.length === 0) {
            // "true" means show config.
            // Load initial Grafana Dashboards
            this.loadGrafanaDashboards();
        }

        super.onAnimationStart(event);
    }

    private calcIframeHeight() {
        this.widgetHeight = this.boxContainer?.nativeElement.offsetHeight;

        let height = this.widgetHeight - 29 - 12; //Unit: px
        //                                        ^ Show / Hide Config button
        //                                            ^ Some Padding

        if (height < 15) {
            height = 15;
        }

        this.widgetHeight = height;
        this.cdr.markForCheck();
    }

    public saveConfig() {
        if (this.grafana_userdashboard_id && this.widget) {
            this.GrafanaUserdefinedWidgetService.saveWidgetConfig(this.widget.id, this.grafana_userdashboard_id).subscribe((response) => {
                // Update the markdown content
                this.load();

                // Close config
                this.flipped.set(false);
            });
        }
    }

    public loadGrafanaDashboards = () => {
        this.subscriptions.add(this.GrafanaUserdefinedWidgetService.loadGrafanaDashboards()
            .subscribe((result) => {

                const dashboards: SelectKeyValue[] = [];
                result.all_userdashboards.forEach((dashboard) => {
                    dashboards.push({
                        key: dashboard.id,
                        value: dashboard.name
                    });
                });

                this.grafanaDashboards = dashboards;

                this.cdr.markForCheck();
            })
        );
    };

    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    public override resizeWidget(event?: KtdResizeEnd) {
        this.calcIframeHeight();
    }

    public override layoutUpdate(event: KtdGridLayout) {

    }
}
