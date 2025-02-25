import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    signal,
    ViewChild
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormLabelDirective,
    InputGroupComponent
} from '@coreui/angular';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectOptgroupComponent } from '../../../../layouts/primeng/select/select-optgroup/select-optgroup.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { TrueFalseDirective } from '../../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { SelectItemOptionGroup, SelectKeyValueString } from '../../../../layouts/primeng/select.interface';
import { Router } from '@angular/router';
import { AnimationEvent } from '@angular/animations';
import { ServicesLoadServicesByStringParams } from '../../../services/services.interface';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { forkJoin } from 'rxjs';
import { TachometerWidgetService } from './tachometer-widget.service';
import { ServicesService } from '../../../services/services.service';
import { ScaleTypes } from '../../../../components/popover-graph/scale-types';
import { RadialGauge } from 'canvas-gauges';
import { TachometerWidgetPerfdata } from './tachometer-widget.interface';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';

@Component({
    selector: 'oitc-tachometer-widget',
    imports: [
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormLabelDirective,
        InputGroupComponent,
        NgIf,
        FormsModule,
        SelectOptgroupComponent,
        TranslocoDirective,
        TrueFalseDirective,
        XsButtonDirective,
        SelectComponent
    ],
    templateUrl: './tachometer-widget.component.html',
    styleUrl: './tachometer-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TachometerWidgetComponent extends BaseWidgetComponent implements AfterViewInit {

    protected flipped = signal<boolean>(false);
    @ViewChild('boxContainer') boxContainer?: ElementRef;
    public widgetHeight: number = 0;

    public isLink: boolean = false;

    public host_id: null | number = null;
    public service_id: null | number = null;
    public metric: string | null = null;
    public isEvcService: boolean = false;
    public showLabel: boolean = false;

    private perfdata?: TachometerWidgetPerfdata;

    public label: string = '';

    public services: SelectItemOptionGroup[] = [];
    public metrics: SelectKeyValueString[] = [];

    private readonly TachometerWidgetService = inject(TachometerWidgetService);
    private readonly ServicesService = inject(ServicesService);

    private router: Router = inject(Router);

    public override load() {
        // Handled by ngAfterViewInit as we need the template to render the gauge
    }

    public ngAfterViewInit(): void {
        this.calcTachometerHeight();

        if (this.widget) {
            this.service_id = null;
            this.metric = '';
            this.TachometerWidgetService.loadWidgetConfig(this.widget.id).subscribe((response) => {
                // is a service selected?

                this.metric = response.config.metric;

                if (!Array.isArray(response.service.Service) && !Array.isArray(response.service.Servicestatus)) {
                    this.service_id = response.service.Service.id;
                    this.host_id = response.service.Service.host_id;
                    this.isEvcService = response.service.Service.isEVCService;
                    this.label = `${response.service.Service.hostname}/${response.service.Service.servicename}`
                }

                this.perfdata = undefined;
                if (!Array.isArray(response.service.Perfdata)) {
                    if (this.metric && response.service.Perfdata[this.metric]) {
                        this.perfdata = response.service.Perfdata[this.metric];
                    }
                }

                this.showLabel = response.config.show_label;

                this.checkUserPermissions();

                this.cdr.markForCheck();

                // Data is loaded, render the gauge
                setTimeout(() => {
                    this.renderGauge();
                }, 100);
            });
        }
    }

    public override onAnimationStart(event: AnimationEvent) {
        if (event.toState && this.services.length === 0) {
            // "true" means show config.
            // Load initial Services
            this.loadServicesByString('');
            if (this.service_id) {
                // User has selected a service, load metrics
                this.loadMetricsByServiceId();
            }
        }

        super.onAnimationStart(event);
    }

    public override onAnimationDone(event: AnimationEvent) {
        super.onAnimationDone(event);

        if (!event.toState) {
            // "false" means show content.
            this.renderGauge();
        }
    }

    private calcTachometerHeight() {
        this.widgetHeight = this.boxContainer?.nativeElement.offsetHeight;

        let height = this.widgetHeight - 29 - 12 - 8; //Unit: px
        //                                        ^ Show / Hide Config button
        //                                             ^ Some Padding
        //                                                 ^ Some random value

        if (height < 15) {
            height = 15;
        }

        this.widgetHeight = height;
        this.cdr.markForCheck();
    }

    public saveConfig() {
        if (this.service_id && this.widget) {
            this.TachometerWidgetService.saveWidgetConfig(this.widget.id, this.service_id, this.showLabel, String(this.metric)).subscribe((response) => {
                // Update the markdown content
                this.ngAfterViewInit();

                // Close config
                this.flipped.set(false);
            });
        }
    }

    public loadServicesByString = (searchString: string) => {
        const params: ServicesLoadServicesByStringParams = {
            angular: true,
            'filter[servicename]': searchString,
            'selected[]': [],
            includeDisabled: false
        };

        if (this.service_id) {
            params['selected[]'].push(this.service_id);
        }

        this.subscriptions.add(this.ServicesService.loadServicesByString(params)
            .subscribe((result) => {
                this.services = result;

                this.cdr.markForCheck();
            })
        );
    };

    public loadMetricsByServiceId = () => {
        if (this.service_id) {
            this.subscriptions.add(this.TachometerWidgetService.loadMetrics(this.service_id)
                .subscribe((result) => {
                    this.metrics = result;

                    this.cdr.markForCheck();
                })
            );
        }
    };

    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    public override resizeWidget(event?: KtdResizeEnd) {
        this.calcTachometerHeight();
        this.renderGauge();
    }

    public override layoutUpdate(event: KtdGridLayout) {

    }

    public naviagteToBrowser() {
        if (this.service_id) {
            if (this.isEvcService) {
                this.subscriptions.add(this.PermissionsService.hasPermissionObservable(['EventcorrelationModule', 'eventcorrelations', 'view']).subscribe((hasPermission) => {
                    if (hasPermission) {
                        this.router.navigate(['/eventcorrelation_module/eventcorrelations/view', this.host_id]);

                        return;
                    }

                    this.subscriptions.add(this.PermissionsService.hasPermissionObservable(['Services', 'browser']).subscribe((hasPermission) => {
                        if (hasPermission) {
                            this.router.navigate(['/services/browser', this.service_id]);
                        }
                    }));
                }));
            } else {
                // Default service
                this.subscriptions.add(this.PermissionsService.hasPermissionObservable(['Services', 'browser']).subscribe((hasPermission) => {
                    if (hasPermission) {
                        this.router.navigate(['/services/browser', this.service_id]);
                    }
                }));
            }
        }
    }

    private checkUserPermissions() {
        forkJoin([
            this.PermissionsService.hasPermissionObservable(['Services', 'browser']),
            this.PermissionsService.hasPermissionObservable(['EventcorrelationModule', 'eventcorrelations', 'view'])
        ]).subscribe(result => {
            this.isLink = result[0] || result[1];
            this.cdr.markForCheck();
        })

    }


    private getThresholdAreas(perfdata: TachometerWidgetPerfdata) {
        const setup = perfdata.datasource.setup;

        let thresholdAreas: any[] = [];
        switch (setup.scale.type) {
            case ScaleTypes.W_O:
                thresholdAreas = [
                    {from: setup.crit.low, to: setup.warn.low, color: '#DF8F1D'},
                    {from: setup.warn.low, to: setup.scale.max, color: '#449D44'}
                ];
                break;
            case ScaleTypes.C_W_O:
                thresholdAreas = [
                    {from: setup.scale.min, to: setup.crit.low, color: '#C9302C'},
                    {from: setup.crit.low, to: setup.warn.low, color: '#DF8F1D'},
                    {from: setup.warn.low, to: setup.scale.max, color: '#449D44'}
                ];
                break;
            case ScaleTypes.O_W:
                thresholdAreas = [
                    {from: setup.scale.min, to: setup.warn.low, color: '#449D44'},
                    {from: setup.warn.low, to: setup.scale.max, color: '#DF8F1D'}
                ];
                break;
            case ScaleTypes.O_W_C:
                thresholdAreas = [
                    {from: setup.scale.min, to: setup.warn.low, color: '#449D44'},
                    {from: setup.warn.low, to: setup.crit.low, color: '#DF8F1D'},
                    {from: setup.crit.low, to: setup.scale.max, color: '#C9302C'}
                ];
                break;
            case ScaleTypes.C_W_O_W_C:
                thresholdAreas = [
                    {from: setup.scale.min, to: setup.crit.low, color: '#C9302C'},
                    {from: setup.crit.low, to: setup.warn.low, color: '#DF8F1D'},
                    {from: setup.warn.low, to: setup.warn.high, color: '#449D44'},
                    {from: setup.warn.high, to: setup.crit.high, color: '#DF8F1D'},
                    {from: setup.crit.high, to: setup.scale.max, color: '#C9302C'}
                ];
                break;
            case ScaleTypes.O_W_C_W_O:
                thresholdAreas = [
                    {from: setup.scale.min, to: setup.crit.low, color: '#449D44'},
                    {from: setup.crit.low, to: setup.warn.low, color: '#DF8F1D'},
                    {from: setup.warn.low, to: setup.warn.high, color: '#C9302C'},
                    {from: setup.warn.high, to: setup.crit.high, color: '#DF8F1D'},
                    {from: setup.crit.high, to: setup.scale.max, color: '#449D44'}
                ];
                break;
            case ScaleTypes.O:
            default:
                break;
        }
        return thresholdAreas;
    }

    private renderGauge() {
        if (!this.widget || !this.perfdata) {
            return;
        }

        let setup = this.perfdata.datasource.setup;
        let units = this.perfdata.unit;
        let label = this.perfdata.metric;

        if (label.length > 20) {
            label = label.substring(0, 20);
            label += '...';
        }

        if (this.showLabel) {
            if (units === null) {
                units = label;
            } else {
                units = label + ' in ' + units;
            }
            label = this.label;
            if (label.length > 20) {
                label = label.substring(0, 20);
                label += '...';
            }
        }

        if (setup.scale.min === null || setup.scale.max === null) {
            setup.scale.min = 0;
            setup.scale.max = 100;
        }

        let thresholds = this.getThresholdAreas(this.perfdata);

        let maxDecimalDigits = 3;
        let currentValueAsString = setup.metric.value.toString();
        let intergetDigits = currentValueAsString.length;
        let decimalDigits = 0;

        if (currentValueAsString.indexOf('.') > 0) {
            let splited = currentValueAsString.split('.');
            intergetDigits = splited[0].length;
            decimalDigits = splited[1].length;
            if (decimalDigits > maxDecimalDigits) {
                decimalDigits = maxDecimalDigits;
            }
        }

        let showDecimalDigitsGauge = 0;
        if (decimalDigits > 0 || (setup.scale.max - setup.scale.min < 10)) {
            showDecimalDigitsGauge = 1;
        }

        let gauge = new RadialGauge({
            renderTo: 'tachometer-widget-canvas-' + this.widget.id,
            height: this.widgetHeight,
            width: this.widgetHeight,
            value: setup.metric.value,
            minValue: setup.scale.min || 0,
            maxValue: setup.scale.max || 100,
            units: units ? units : '',
            strokeTicks: true,
            title: label,
            valueInt: intergetDigits,
            valueDec: decimalDigits,
            majorTicksDec: showDecimalDigitsGauge,
            highlights: thresholds,
            animationDuration: 700,
            animationRule: 'elastic',
            majorTicks: this.getMajorTicks(setup.scale.min, setup.scale.max, 5)
        });

        gauge.draw();

        //Update value
        //gauge.value = 1337;
    };

    private getMajorTicks(perfdataMin: number, perfdataMax: number, numberOfTicks: number) {
        numberOfTicks = Math.abs(Math.ceil(numberOfTicks));
        let tickSize = Math.round((perfdataMax - perfdataMin) / numberOfTicks),
            tickArr = [],
            myTick = perfdataMin;

        for (let index = 0; index <= numberOfTicks; index++) {
            tickArr.push(myTick);

            myTick += tickSize;
        }

        return tickArr;
    };


}
