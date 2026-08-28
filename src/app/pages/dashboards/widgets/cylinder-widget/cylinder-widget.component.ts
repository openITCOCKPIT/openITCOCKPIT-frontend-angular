import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject, Renderer2,
    signal,
    ViewChild
} from '@angular/core';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormLabelDirective
} from '@coreui/angular';
import { NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectOptgroupComponent } from '../../../../layouts/primeng/select/select-optgroup/select-optgroup.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { TrueFalseDirective } from '../../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { SelectItemOptionGroup, SelectKeyValueString } from '../../../../layouts/primeng/select.interface';
import { Router } from '@angular/router';
import { ServicesLoadServicesByStringParams } from '../../../services/services.interface';

import { forkJoin } from 'rxjs';
import { CylinderWidgetService } from './cylinder-widget.service';
import { ServicesService } from '../../../services/services.service';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { ServiceTypesEnum } from '../../../services/services.enum';


import { KtdResizeEnd } from '@katoid/angular-grid-layout';
import {PerformanceWidgetPerfdata} from '../widgets.interface'
import { AnimationEvent } from '@angular/animations';

@Component({
    selector: 'oitc-cylinder-widget',
    imports: [
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormLabelDirective,
        ReactiveFormsModule,
        SelectComponent,
        SelectOptgroupComponent,
        TranslocoDirective,
        TrueFalseDirective,
        XsButtonDirective,
        NgClass,
        FormsModule
    ],
    templateUrl: './cylinder-widget.component.html',
    styleUrl: './cylinder-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CylinderWidgetComponent extends BaseWidgetComponent implements AfterViewInit {
    protected flipped = signal<boolean>(false);
    @ViewChild('boxContainer') boxContainer?: ElementRef;
    @ViewChild('cylinderSvg', {static: false}) cylinderSvg!: ElementRef<SVGElement>;

    public widgetHeight: number = 0;
    public service_id: null | number = null;
    public isLink: boolean = false;
    public services: SelectItemOptionGroup[] = [];
    private readonly ServicesService = inject(ServicesService);
    private readonly CylinderWidgetService = inject(CylinderWidgetService);
    public metric: string | null = null;
    public metrics: SelectKeyValueString[] = [];
    private router: Router = inject(Router);

    private perfdata?: PerformanceWidgetPerfdata;
    private current_state: number = -1;

    public host_id: null | number = null;
    public isEvcService: boolean = false;
    public label: string = '';

    public width= 0;
    public height = 0;

    public showLabel: boolean = false;
    private readonly renderer: Renderer2 = inject(Renderer2);

    public widgetID : number = 0;

    public override resizeWidget(event?: KtdResizeEnd) {
        this.calcCylinderSize();
        this.renderCylinder();
    }

    public override load() {
        // Handled by ngAfterViewInit as we need the template to render Cylinder
    }

    public ngAfterViewInit(): void {
        this.calcCylinderSize();

        if (this.widget) {

            this.widgetID = Number(this.widget.id);
            this.service_id = null;
            this.metric = '';

            this.CylinderWidgetService.loadWidgetConfig(this.widget.id).subscribe((response) => {
                // is a service selected?
                this.metric = response.config.metric;

                if (!Array.isArray(response.service.Service) && !Array.isArray(response.service.Servicestatus)) {
                    this.service_id = response.service.Service.id;
                    this.host_id = response.service.Service.host_id;
                    this.isEvcService = response.service.Service.isEVCService;
                    this.label = `${response.service.Service.hostname}/${response.service.Service.servicename}`

                    this.loadServicesByString('');
                    this.loadMetricsByServiceId();

                    if (response.service.Servicestatus.currentState != undefined){
                        this.current_state = response.service.Servicestatus.currentState;
                    }
                }

                this.perfdata = undefined;

                let metricKey = this.metric;

                if (!Array.isArray(response.service.Perfdata)) {
                    if (!Array.isArray(response.service.Service)) {
                        if (response.service.Service.serviceType === ServiceTypesEnum.PROMETHEUS_SERVICE && metricKey === 'value') {
                            metricKey = Object.keys(response.service.Perfdata)[0];
                        }
                    }

                    if (metricKey && response.service.Perfdata[metricKey]) {
                        this.perfdata = response.service.Perfdata[metricKey];
                    }
                }

                this.showLabel = response.config.show_label;

                this.checkUserPermissions();

                this.cdr.markForCheck();

                setTimeout(() => {
                    this.renderCylinder();
                }, 100);
            });
        }
    }

    protected naviagteToBrowser() {

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
            this.subscriptions.add(this.CylinderWidgetService.loadMetrics(this.service_id)
                .subscribe((result) => {
                    this.metrics = result;

                    this.cdr.markForCheck();
                })
            );
        }
    };

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
            this.renderCylinder();
        }
    }

    public saveConfig() {
        if (this.service_id && this.widget) {
            this.CylinderWidgetService.saveWidgetConfig(this.widget.id, this.service_id, this.showLabel, String(this.metric)).subscribe((response) => {
                this.ngAfterViewInit();

                // Close config
                this.flipped.set(false);
            });
        }
    }

    private calcCylinderSize() {
        this.height = this.boxContainer?.nativeElement.offsetHeight;
        this.width = this.boxContainer?.nativeElement.offsetWidth ;

        this.height = Math.max(this.height - 49,100) ; //Unit: px

        this.cdr.markForCheck();
    }
    private renderCylinder(): void {
        if (!this.widget || !this.perfdata) {
            return;
        }
        const setup = this.perfdata.datasource.setup;

        const svg = this.cylinderSvg.nativeElement;
        svg.innerHTML = '';

        let currentVal  = setup.metric.value ?? 0;
        let unit = setup.metric.unit ?? '%';
        let min = setup.scale.min ?? 0;
        let max = setup.scale.max ?? currentVal

        if (max < currentVal) {
            max = currentVal;
        }

        if ( unit == '%' && max == 0){
            max = 100;
        }

        let percentage : number = (max - min) > 0 ? ((currentVal - min) / (max - min)) * 99 : 0;
        percentage = +Number(percentage);

        const currentText = `${Number.isInteger(currentVal) ? currentVal : currentVal.toFixed(2)} ${unit}`;
        const maxText = `${max} ${unit}`;

        const maxTextLength = Math.max(currentText.length, maxText.length);
        const x = Math.min(Math.max(maxTextLength * 10, 75), 120);
        const cylinderWidth = Math.max(this.width - (x * 2), 40);

        const y = 10;
        const ellipseBottomCy = this.height;
        const availableHeight = ellipseBottomCy - y;

        const maxChars = Math.max(Math.floor(this.width / 7.5), 10);

        let label = this.label ?? '';
        if (label.length > maxChars) {
            label = label.substring(0, maxChars);
            label += '...';
        }
        //ready for the ellipse
        const rx = cylinderWidth / 2;
        const ry = 10;
        //calculate positions for the Cylinder
        const ellipseCx = x + rx;

        let pxValue = (availableHeight * percentage) / 100;
        let rectY = this.height - pxValue;
        let topEllipseY = rectY;

        const cylinderGroup = this.renderer.createElement('g', 'svg');
        this.renderer.setAttribute(cylinderGroup, 'id', 'cylinder_' + this.widgetID);
        this.renderer.appendChild(svg, cylinderGroup);
        this.renderer.setAttribute(svg, 'viewBox', `0 0 ${this.width} ${this.height+25}`);

        const defs = this.renderer.createElement('defs', 'svg');
        this.renderer.appendChild(svg, defs);

        const stateColor = this.getStateColor(this.current_state);

        this.createCylinderGradients(defs, stateColor);

        //current value in cylinder
        let leftLineLength = 6;
        const fontSize = currentText.length > 15 ? '12px' : '14px';

        //inner Cylinder (the value)
        this.createEllipse(cylinderGroup, ellipseCx, ellipseBottomCy - ry, rx, ry, `url(#fadeDark${stateColor}_${this.widgetID})`, 0.8);

        if (currentVal > 0) {
            if (max > 0) {
                rectY -= ry;
                pxValue += ry;
                if (percentage == 0){
                    topEllipseY -= 10;
                    pxValue -= ry;
                }
            } else {
                topEllipseY += ry;
            }
            if (currentVal < 1) {
                if (percentage > 0 && percentage < 99) {
                    topEllipseY -= 10;
                }
                rectY -= 5;
            }
        } else {
            topEllipseY -= ry;
        }

        topEllipseY = Math.min(Math.max(topEllipseY, y), ellipseBottomCy - ry);

        this.createRect(cylinderGroup, x, rectY, cylinderWidth, pxValue, rx, ry, `url(#fade${stateColor}_${this.widgetID})`, 0.9);
        //top ellipse
        const innerTopEllipse = this.createEllipse(cylinderGroup, ellipseCx, topEllipseY, rx, ry, `url(#fadeDark${stateColor}_${this.widgetID})`, 0.8);
        if (innerTopEllipse) {
            if (percentage > 5) {
                this.renderer.setAttribute(innerTopEllipse, 'class', 'fluid-top-surface');
            } else if (percentage > 0) {
                this.renderer.setAttribute(innerTopEllipse, 'class', 'fluid-top-surface-light');
            }
        }
        //current value inner cylinder
        this.createRect(cylinderGroup, x, 0, cylinderWidth, this.height, rx, ry, `url(#fadeGray_${this.widgetID})`, 0.5, 2, '#CECECE', 0.3, 'background_' + this.widgetID);

        //Outer Cylinder - center rect
        this.createEllipse(cylinderGroup, ellipseCx, y , rx, ry, `url(#fadeDarkGray_${this.widgetID})`, 0.1, 2, '#CECECE', 0.2 );

        //current Label value in cylinder
        this.createLabelLine(cylinderGroup, x - leftLineLength -1 , topEllipseY-1, 'left', undefined, leftLineLength);
        this.createLabel(cylinderGroup, x - leftLineLength - 3, topEllipseY-1, currentText, fontSize, undefined, 'end');

        //Cylinder current text label
        if (max !== null && max !== 0) {
            let ticksCount = currentVal <= 1 ? 1 : currentVal <= 60 ? 3 : currentVal <= 100 ? 4 : 5;
            this.renderGradientLabels(cylinderGroup, cylinderWidth + x + 2, y, availableHeight, unit, max, min, ticksCount);
        } else {
            // min base lable - 0 label
            this.createLabelLine(cylinderGroup, cylinderWidth + x + 2, availableHeight );
            this.createLabel(cylinderGroup, cylinderWidth + x + 18, availableHeight, '0', '13px', undefined );
        }

        if (this.showLabel) {
            this.createLabel(cylinderGroup, ellipseCx, ellipseBottomCy+18, label, '13px', undefined, 'middle','normal',this.label);
        }
    }

    private createLinearGradient(defs: any, id: string, stops: {
        offset: string, color: string }[], x1?: number, y1?: number, x2?: number): void {
        const linearGradient = this.renderer.createElement('linearGradient', 'svg');
        this.renderer.setAttribute(linearGradient, 'id', id);
        if (x1 !== undefined) {
            this.renderer.setAttribute(linearGradient, 'x1', x1.toString());
        }
        if (y1 !== undefined) {
            this.renderer.setAttribute(linearGradient, 'y1', y1.toString());
        }
        if (x2 !== undefined) {
            this.renderer.setAttribute(linearGradient, 'x2', x2.toString());
        }
        stops.forEach(stop => {
            const stopElement = this.renderer.createElement('stop', 'svg');
            this.renderer.setAttribute(stopElement, 'offset', stop.offset);
            this.renderer.setAttribute(stopElement, 'stop-color', stop.color);
            this.renderer.appendChild(linearGradient, stopElement);
        });

        this.renderer.appendChild(defs, linearGradient);
    }

    private createEllipse(parent: any, cx: number, cy: number, rx: number, ry: number, fill: string, fillOpacity: number, strokeWidth?: number, stroke?: string, strokeOpacity?: number, id?: string) {
        const ellipse = this.renderer.createElement('ellipse', 'svg');
        this.renderer.setAttribute(ellipse, 'cx', cx.toString());
        this.renderer.setAttribute(ellipse, 'cy', cy.toString());
        this.renderer.setAttribute(ellipse, 'rx', rx.toString());
        this.renderer.setAttribute(ellipse, 'ry', ry.toString());
        this.renderer.setAttribute(ellipse, 'fill', fill);
        this.renderer.setAttribute(ellipse, 'fill-opacity', fillOpacity.toString());
        if (strokeWidth) {
            this.renderer.setAttribute(ellipse, 'stroke-width', strokeWidth.toString());
        }
        if (stroke) {
            this.renderer.setAttribute(ellipse, 'stroke', stroke);
        }
        if (strokeOpacity) {
            this.renderer.setAttribute(ellipse, 'stroke-opacity', strokeOpacity.toString());
        }
        if (id) {
            this.renderer.setAttribute(ellipse, 'id', id);
        }
        this.renderer.appendChild(parent, ellipse);

        return ellipse;
    }

    private createRect(parent: any, x: number, y: number, width: number, height: number, rx: number, ry: number, fill: string, fillOpacity: number, strokeWidth?: number, stroke?: string, strokeOpacity?: number, id?: string): void {
        const rect = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(rect, 'x', x.toString());
        this.renderer.setAttribute(rect, 'y', y.toString());
        this.renderer.setAttribute(rect, 'width', width.toString());
        this.renderer.setAttribute(rect, 'height', height.toString());
        this.renderer.setAttribute(rect, 'rx', rx.toString());
        this.renderer.setAttribute(rect, 'ry', ry.toString());
        this.renderer.setAttribute(rect, 'fill', fill);
        this.renderer.setAttribute(rect, 'fill-opacity', fillOpacity.toString());
        if (strokeWidth) {
            this.renderer.setAttribute(rect, 'stroke-width', strokeWidth.toString());
        }
        if (stroke) {
            this.renderer.setAttribute(rect, 'stroke', stroke);
        }
        if (strokeOpacity) {
            this.renderer.setAttribute(rect, 'stroke-opacity', strokeOpacity.toString());
        }
        if (id) {
            this.renderer.setAttribute(rect, 'id', id);
        }
        this.renderer.appendChild(parent, rect);
    }

    private renderGradientLabels(cylinderGroup: any, startX: number, topY: number, bottomY: number, unit :string  = '' , max: number, min:number , ticksCount: number = 3) {
        const totalHeight = bottomY - topY;
        const numericMin = Number(min);
        const numericMax = Number(max);

        for (let i = 0; i <= ticksCount; i++) {
            const ratio = i / ticksCount;
            const currentY = bottomY - (ratio * totalHeight);
            const rawValue = numericMin + ratio * (numericMax - numericMin);

            const currentValue = Math.round(Number(rawValue));

            this.createLabelLine(cylinderGroup, startX, currentY);

            const labelText = `${currentValue} ${unit}`;

            this.createLabel(cylinderGroup, startX + 8, currentY + 1, labelText, '12px');
        }
    }

    private createCylinderGradients(defs: any, stateColor: string): void {

        this.createLinearGradient(defs, `fadeGray_${this.widgetID}`, [
            {offset: '0%', color: '#AFAFAF'},
            {offset: '20%', color: '#FFFFFF'},
            {offset: '70%', color: '#AFAFAF'},
            {offset: '100%', color: '#A0A0A0'}
        ], 0, 0, 1);

        this.createLinearGradient(defs, `fadeDarkGray_${this.widgetID}`, [
            {offset: '0%', color: '#757575'},
            {offset: '20%', color: '#939393'},
            {offset: '100%', color: '#757575'}
        ]);

        const colorMap: Record<string, { main: any[], dark: any[] }> = {
            Green: {
                main: [{offset: '0%', color: '#00cc00'}, {offset: '20%', color: '#5BFF5B'}, {offset: '70%', color: '#006600'}],
                dark: [{offset: '0%', color: '#00AD00'}, {offset: '60%', color: '#006600'}, {offset: '70%', color: '#005600'}]
            },
            Yellow: {
                main: [{offset: '0%', color: '#FFCC00'}, {offset: '20%', color: '#FFFF5B'}, {offset: '70%', color: '#E5BB00'}],
                dark: [{offset: '0%', color: '#FFAD00'}, {offset: '60%', color: '#E5BB00'}, {offset: '70%', color: '#E2B100'}]
            },
            Red: {
                main: [{offset: '0%', color: '#CE0D00'}, {offset: '20%', color: '#FF0000'}, {offset: '70%', color: '#BF1600'}],
                dark: [{offset: '0%', color: '#c91400'}, {offset: '60%', color: '#BF1600'}, {offset: '70%', color: '#BF0600'}]
            },
            Blue: {
                main: [{offset: '0%', color: '#0006D5'}, {offset: '20%', color: '#1248D5'}, {offset: '70%', color: '#0006D5'}],
                dark: [{offset: '0%', color: '#000674'}, {offset: '20%', color: '#0006B8'}, {offset: '100%', color: '#000674'}]
            }
        };

        const config = colorMap[stateColor] ?? colorMap['Green'];
        this.createLinearGradient(defs, `fade${stateColor}_${this.widgetID}`, config.main);
        this.createLinearGradient(defs, `fadeDark${stateColor}_${this.widgetID}`, config.dark);
    }

    private createLabel (parent: any, x: number = 0, y: number = 0, content:string , fontSize: string = '11px', color: string = '#888888',textAnchor: string = 'start',fontWeight: string = 'normal',tooltip?:string): void {

        const textElement = this.renderer.createElement('text', 'svg');
        this.renderer.setAttribute(textElement, 'x', x.toString());
        this.renderer.setAttribute(textElement, 'y', y.toString());
        this.renderer.setAttribute(textElement, 'fill', color);
        this.renderer.setAttribute(textElement, 'font-size', fontSize);
        this.renderer.setAttribute(textElement, 'font-weight', fontWeight);
        this.renderer.setAttribute(textElement, 'dominant-baseline', 'middle');
        this.renderer.setAttribute(textElement, 'text-anchor', textAnchor);
        if (tooltip) {
            const titleElement = this.renderer.createElement('title', 'svg');
            const titleText = this.renderer.createText(tooltip);
            this.renderer.appendChild(titleElement, titleText);
            this.renderer.appendChild(textElement, titleElement);
        }
        const textNode = this.renderer.createText(content);
        this.renderer.appendChild(textElement, textNode);
        this.renderer.appendChild(parent, textElement);

    }

    private createLabelLine (parent: any, x: number, y: number,postion:string='left',color:string='#666666',length:number = 6): void {

        const line = this.renderer.createElement('line', 'svg');
        this.renderer.setAttribute(line, 'x1', (x).toString());
        this.renderer.setAttribute(line, 'y1', y.toString());
        if (postion=='right'){
            this.renderer.setAttribute(line, 'x2', (x-length).toString());
        } else {
            this.renderer.setAttribute(line, 'x2', (x+length).toString());

        }
        this.renderer.setAttribute(line, 'y2', y.toString());
        this.renderer.setAttribute(line, 'stroke', color);
        this.renderer.setAttribute(line, 'stroke-width', '1');
        this.renderer.appendChild(parent, line);
    }

    private getStateColor(state: number): string {
        switch (state) {
            case 0:
                return 'Green';
            case 1:
                return 'Yellow';
            case 2:
                return 'Red';
            case 3:
                return 'Gray';
            default:
                return 'Blue';
        }
    }


}
