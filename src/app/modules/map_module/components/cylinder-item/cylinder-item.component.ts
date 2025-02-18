import {
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    input,
    InputSignal,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MapCanvasComponent } from '../map-canvas/map-canvas.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MapItemBaseComponent } from '../map-item-base/map-item-base.component';
import { Mapgadget } from '../../pages/mapeditors/Mapeditors.interface';
import { MapItemType } from '../map-item-base/map-item-base.enum';
import { interval, Subscription } from 'rxjs';
import { CylinderItemService } from './cylinder-item.service';
import {
    CylinderItemRoot,
    CylinderItemRootParams,
    Host,
    Perfdata,
    PerformanceData,
    Service
} from './cylinder-item.interface';
import { ResizableDirective } from '../../../../directives/resizable.directive';
import { NgIf, NgStyle } from '@angular/common';

@Component({
    selector: 'oitc-cylinder-item',
    standalone: true,
    imports: [CdkDrag, ContextMenuModule, CdkDragHandle, ResizableDirective, NgStyle, NgIf],
    templateUrl: './cylinder-item.component.html',
    styleUrl: './cylinder-item.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CylinderItemComponent extends MapItemBaseComponent<Mapgadget> implements OnInit, OnDestroy {
    @ViewChild('cylinderSvg', {static: false}) cylinderSvg!: ElementRef<SVGElement>;

    public override item: InputSignal<Mapgadget | undefined> = input<Mapgadget>();
    public refreshInterval = input<number>(0);

    private subscriptions: Subscription = new Subscription();
    private readonly CylinderItemService = inject(CylinderItemService);
    private statusUpdateInterval: Subscription = new Subscription();

    protected override type = MapItemType.GADGET;

    protected init: boolean = true;
    protected width: number = 80;
    protected height: number = 125;
    private intervalStartet: boolean = false; // needed to prevent multiple interval subscriptions
    protected Host!: Host;
    protected Service!: Service;
    private current_state: number = 0;
    private responsePerfdata!: Perfdata;
    private perfdataName: string = '';
    private perfdata: PerformanceData | undefined;

    constructor(parent: MapCanvasComponent, private renderer: Renderer2) {
        super(parent);
        effect(() => {
            this.onObjectIdChange();
            this.onSizeXShowLabelMetricChange();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.stop();
    }

    public ngOnInit(): void {

        this.item()!.size_x = parseInt(this.item()!.size_x.toString(), 10);
        this.item()!.size_y = parseInt(this.item()!.size_y.toString(), 10);

        if (this.item()!.size_x > 0) {
            this.width = this.item()!.size_x;
        }
        if (this.item()!.size_y > 0) {
            this.height = this.item()!.size_y;
        }

        this.load();
    }

    private load() {

        const params: CylinderItemRootParams = {
            'angular': true,
            'disableGlobalLoader': true,
            'objectId': this.item()!.object_id as number,
            'mapId': this.item()!.map_id as number,
            'type': this.item()!.type as string
        };

        this.subscriptions.add(this.CylinderItemService.getCylinderItem(params)
            .subscribe((result: CylinderItemRoot) => {
                this.current_state = result.data.Servicestatus.currentState;

                this.Host = result.data.Host;
                this.Service = result.data.Service;


                this.responsePerfdata = result.data.Perfdata;
                this.processPerfdata();
                this.renderCylinder(this.perfdata);

                this.initRefreshTimer();

                this.init = false;

                this.cdr.markForCheck();
            }));
    };

    private renderCylinder(perfdata: any): void {
        if (!perfdata) {
            return;
        }

        const svg = this.cylinderSvg.nativeElement;
        svg.innerHTML = '';

        let value = 0;
        if (isNaN(perfdata.max) && !isNaN(perfdata.critical)) {
            perfdata.max = perfdata.critical;
        }
        if (!isNaN(perfdata.max)) {
            value = (parseInt(perfdata.current) / parseInt(perfdata.max)) * 100;
            //todo fix me
            if (value > 90) {
                value = 90;
            }
        }

        const x = 0;
        const y = 10;
        //radii for the ellipse
        const rx = this.width / 2;
        const ry = 10;
        //calculate positions for the Cylinder
        const ellipseCx = x + rx;
        const ellipseBottomCy = this.height;
        const rectX = x;
        const rectY = y;
        const ellipseTopCy = y;
        const pxValue = this.height * value / 100;
        const newRectY = this.height - pxValue;
        const newTopEllipseY = newRectY;

        //the id schema must be like this "cyliner_"+id
        const cylinderGroup = this.renderer.createElement('g', 'svg');
        this.renderer.setAttribute(cylinderGroup, 'id', 'cylinder_' + this.item()!.id);
        this.renderer.appendChild(svg, cylinderGroup);

        if (this.item()!.show_label) {
            const rotateX = parseInt((this.height - 10 - (this.width / 8)).toString(), 10); //10 is svg padding 16 is font size;
            const textElement = this.renderer.createElement('text', 'svg');
            this.renderer.setAttribute(textElement, 'x', '0');
            this.renderer.setAttribute(textElement, 'y', (this.height - 10).toString());
            this.renderer.setAttribute(textElement, 'font-size', (this.width / 8).toString());
            this.renderer.setAttribute(textElement, 'font-family', 'Verdana');
            this.renderer.setAttribute(textElement, 'fill', '#000');
            this.renderer.setAttribute(textElement, 'transform', `rotate(-90, 0, ${rotateX})`);
            const textContent = this.renderer.createText(this.Host.hostname + '/' + this.Service.servicename);
            this.renderer.appendChild(textElement, textContent);
            this.renderer.appendChild(svg, textElement);
        }

        const defs = this.renderer.createElement('defs', 'svg');
        this.renderer.appendChild(svg, defs);

        const stateColor = this.getStateColor(this.current_state);

        this.createLinearGradient(defs, `fadeGreen_${this.item()!.id}`, [
            {offset: '0%', color: '#00cc00'},
            {offset: '20%', color: '#5BFF5B'},
            {offset: '70%', color: '#006600'}
        ]);
        this.createLinearGradient(defs, `fadeDarkGreen_${this.item()!.id}`, [
            {offset: '0%', color: '#00AD00'},
            {offset: '60%', color: '#006600'},
            {offset: '70%', color: '#005600'}
        ]);
        this.createLinearGradient(defs, `fadeYellow_${this.item()!.id}`, [
            {offset: '0%', color: '#FFCC00'},
            {offset: '20%', color: '#FFFF5B'},
            {offset: '70%', color: '#E5BB00'}
        ]);
        this.createLinearGradient(defs, `fadeDarkYellow_${this.item()!.id}`, [
            {offset: '0%', color: '#FFAD00'},
            {offset: '60%', color: '#E5BB00'},
            {offset: '70%', color: '#E2B100'}
        ]);
        this.createLinearGradient(defs, `fadeRed_${this.item()!.id}`, [
            {offset: '0%', color: '#CE0D00'},
            {offset: '20%', color: '#FF0000'},
            {offset: '70%', color: '#BF1600'}
        ]);
        this.createLinearGradient(defs, `fadeDarkRed_${this.item()!.id}`, [
            {offset: '0%', color: '#c91400'},
            {offset: '60%', color: '#BF1600'},
            {offset: '70%', color: '#BF0600'}
        ]);
        this.createLinearGradient(defs, `fadeGray_${this.item()!.id}`, [
            {offset: '0%', color: '#AFAFAF'},
            {offset: '20%', color: '#FFFFFF'},
            {offset: '70%', color: '#AFAFAF'},
            {offset: '100%', color: '#A0A0A0'}
        ], 0, 0, 1);
        this.createLinearGradient(defs, `fadeDarkGray_${this.item()!.id}`, [
            {offset: '0%', color: '#757575'},
            {offset: '20%', color: '#939393'},
            {offset: '100%', color: '#757575'}
        ]);
        this.createLinearGradient(defs, `fadeBlue_${this.item()!.id}`, [
            {offset: '0%', color: '#0006D5'},
            {offset: '20%', color: '#1248D5'},
            {offset: '70%', color: '#0006D5'}
        ]);
        this.createLinearGradient(defs, `fadeDarkBlue_${this.item()!.id}`, [
            {offset: '0%', color: '#000674'},
            {offset: '20%', color: '#0006B8'},
            {offset: '100%', color: '#000674'}
        ]);

        //outer Cylinder
        //bottom ellipse
        this.createEllipse(cylinderGroup, ellipseCx, ellipseBottomCy - 10, rx, ry, `url(#fadeDarkGray_${this.item()!.id})`, 0.1, 2, '#CECECE', 0.5, 'background_' + this.item()!.id);

        //inner Cylinder (the value)
        //bottom ellipse
        this.createEllipse(cylinderGroup, ellipseCx, ellipseBottomCy - 10, rx, ry, `url(#fadeDark${stateColor}_${this.item()!.id})`, 0.8);

        //center rect
        if (value > 1) {
            this.createRect(cylinderGroup, rectX, newRectY - 10, this.width, pxValue + 10, rx, ry, `url(#fade${stateColor}_${this.item()!.id})`, 0.9);
            //top ellipse
            this.createEllipse(cylinderGroup, ellipseCx, newTopEllipseY, rx, ry, `url(#fadeDark${stateColor}_${this.item()!.id})`, 0.8);
        }

        //outer Cylinder
        //top ellipse
        this.createEllipse(cylinderGroup, ellipseCx, ellipseTopCy, rx, ry, `url(#fadeDarkGray_${this.item()!.id})`, 0.0, 2, '#CECECE', 0.4);

        //center rect
        this.createRect(cylinderGroup, rectX, rectY - 10, this.width, this.height, rx, ry, `url(#fadeGray_${this.item()!.id})`, 0.5, 2, '#CECECE', 0.3, 'background_' + this.item()!.id);
    }

    private createLinearGradient(defs: any, id: string, stops: {
        offset: string,
        color: string
    }[], x1?: number, y1?: number, x2?: number): void {
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

    private createEllipse(parent: any, cx: number, cy: number, rx: number, ry: number, fill: string, fillOpacity: number, strokeWidth?: number, stroke?: string, strokeOpacity?: number, id?: string): void {
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

    private processPerfdata() {
        if (this.responsePerfdata !== null) {
            if (this.item()!.metric !== null && this.responsePerfdata.hasOwnProperty(this.item()!.metric)) {
                this.perfdataName = this.item()!.metric;
                this.perfdata = this.responsePerfdata[this.item()!.metric];
            } else {
                //Use first metric.
                for (let metricName in this.responsePerfdata) {
                    this.perfdataName = metricName;
                    this.perfdata = this.responsePerfdata[metricName];
                    break;
                }
            }
        }
        if (this.perfdata) {
            this.perfdata.current = parseFloat(this.perfdata.current).toString();
            this.perfdata.warning = parseFloat(this.perfdata.warning).toString();
            this.perfdata.critical = parseFloat(this.perfdata.critical).toString();
            this.perfdata.min = parseFloat(this.perfdata.min).toString();
            this.perfdata.max = parseFloat(this.perfdata.max).toString();
        }
    };

    private initRefreshTimer() {
        if (this.refreshInterval() > 0 && !this.intervalStartet) {
            this.intervalStartet = true;
            this.statusUpdateInterval = interval(this.refreshInterval()).subscribe(() => {
                this.load();
            });
        }
    };

    private stop() {
        if (this.intervalStartet) {
            this.statusUpdateInterval.unsubscribe();
            this.cdr.markForCheck();
        }
    };

    private onSizeXShowLabelMetricChange() {
        if (this.init) {
            return;
        }

        this.width = this.item()!.size_x - 10; //The view adds 10px
        this.height = this.item()!.size_y - 10;

        this.processPerfdata();
        this.renderCylinder(this.perfdata);
        this.cdr.markForCheck();
    }

    private onObjectIdChange() {
        if (this.init) {
            return;
        }

        this.load();
    }

}
