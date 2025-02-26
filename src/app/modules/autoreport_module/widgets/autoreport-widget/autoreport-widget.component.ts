import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    signal,
    ViewChild
} from '@angular/core';
import { BaseWidgetComponent } from '../../../../pages/dashboards/widgets/base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { AnimationEvent } from '@angular/animations';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormLabelDirective,
    RowComponent
} from '@coreui/angular';
import { AsyncPipe, NgIf } from '@angular/common';
import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { AutoreportWidgetService } from './autoreport-widget.service';
import { AutoreportWidgetAutoreport, AutoreportWidgetConfig } from './autoreport-widget.interface';
import { FormsModule } from '@angular/forms';
import {
    AutoreportAvailibilityColorsComponent
} from './autoreport-availibility-colors/autoreport-availibility-colors.component';
import { RouterLink } from '@angular/router';
import {
    SparklineBarApexchartComponent
} from '../../../../components/charts/sparkline-bar-apexchart/sparkline-bar-apexchart.component';
import { SparklineBarMetric } from '../../../../components/charts/charts.interface';

@Component({
    selector: 'oitc-autoreport-widget',
    imports: [
        FaIconComponent,
        FormLabelDirective,
        NgIf,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        RowComponent,
        ColComponent,
        FormsModule,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        AutoreportAvailibilityColorsComponent,
        AsyncPipe,
        RouterLink,
        SparklineBarApexchartComponent
    ],
    templateUrl: './autoreport-widget.component.html',
    styleUrl: './autoreport-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoreportWidgetComponent extends BaseWidgetComponent implements AfterViewInit {
    protected flipped = signal<boolean>(false);
    @ViewChild('boxContainer') boxContainer?: ElementRef;
    public widgetHeight: number = 0;
    public fontSize: number = 12;

    //public backgroundColor: string = '#4285F4'; // v4 primary
    public backgroundColor: string = '#5856d6';   // v5 primary

    public autoreport_id: number | null = null;
    public autoreport?: AutoreportWidgetAutoreport;
    public last_percent_value: number = 0;

    public sparklineData: SparklineBarMetric[] = [];
    public maxValueInMinutes?: number = 0;

    public config?: AutoreportWidgetConfig;
    public autoreports: SelectKeyValue[] = [];

    private readonly AutoreportWidgetService = inject(AutoreportWidgetService);

    public override load() {
        if (this.widget) {
            this.AutoreportWidgetService.loadWidgetConfig(this.widget.id).subscribe((response) => {
                this.autoreport_id = response.autoreport.id;
                this.autoreport = undefined;
                this.last_percent_value = 0;
                this.sparklineData = [];

                let maxValueInMinutes: number = 0;
                this.maxValueInMinutes = undefined;

                if (response.autoreport) {
                    this.autoreport = response.autoreport;
                    this.last_percent_value = Number(response.autoreport.last_percent_value);

                    if (response.autoreport.autoreport_availability_log) {
                        response.autoreport.autoreport_availability_log.forEach((log) => {
                            if (response.config.Autoreport.in_percent) {
                                this.sparklineData.push({
                                    name: log.determined_availability_percent + '%',
                                    value: log.determined_availability_percent
                                });
                            } else {
                                this.sparklineData.push({
                                    name: log.determined_availability_time.toString(),
                                    value: log.determined_availability_time
                                });

                                // For the max in the sparkline chart
                                if (maxValueInMinutes < log.determined_availability_time) {
                                    maxValueInMinutes = log.determined_availability_time;
                                    this.maxValueInMinutes = maxValueInMinutes
                                }
                            }

                        });
                    }

                }

                this.config = response.config.Autoreport;
                this.cdr.markForCheck();
            });
        }
    }

    public ngAfterViewInit(): void {
        this.resizeWidget();
    }

    public override onAnimationStart(event: AnimationEvent) {
        if (event.toState && this.autoreports.length === 0) {
            // "true" means show config.
            // Load initial Grafana Dashboards
            this.loadAutoreports();
        }

        super.onAnimationStart(event);
    }

    public saveConfig() {
        if (this.config && this.widget) {
            this.AutoreportWidgetService.saveWidgetConfig(this.widget.id, this.config).subscribe((response) => {
                // Update the markdown content
                this.load();

                // Close config
                this.flipped.set(false);
            });
        }
    }

    public loadAutoreports = () => {
        this.subscriptions.add(this.AutoreportWidgetService.loadAutoreports()
            .subscribe((result) => {
                this.autoreports = result;

                this.cdr.markForCheck();
            })
        );
    };

    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    public override resizeWidget(event?: KtdResizeEnd) {
        this.widgetHeight = this.boxContainer?.nativeElement.offsetHeight;
        this.widgetHeight = this.widgetHeight - 30 - 8; // 30px = editbutton 5px random padding

        this.calcFontSize();
        this.cdr.markForCheck();
    }

    public override layoutUpdate(event: KtdGridLayout) {

    }

    private getBackgroundColor(value: number, minimalAvailability: number): string {
        //value from 0 to 100
        let colorLightness = 40;
        let hue = 120;
        if (value < 100 && value < minimalAvailability) {
            hue = 0;
        } else if (value < 100 && value >= minimalAvailability) {
            hue = Math.floor(((value - minimalAvailability) / (100 - minimalAvailability)) * 120);
            if (hue > 120) {
                hue = 120;
            }
        }
        return ['hsl(', hue, ',100%,' + colorLightness + '%)'].join('');
    };

    private calcFontSize() {
        this.fontSize = Math.floor(this.widgetHeight / 8.5);

        if (this.config?.in_percent) {
            this.fontSize = Math.floor(this.widgetHeight / 4.5);
        }

        if (this.fontSize < 2) {
            this.fontSize = 2;
        }

        this.cdr.markForCheck();
    }
}
