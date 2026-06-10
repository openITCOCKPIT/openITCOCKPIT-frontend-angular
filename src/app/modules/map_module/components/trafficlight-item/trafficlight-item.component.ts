import {
    ChangeDetectionStrategy,
    Component,
    DOCUMENT,
    effect,
    ElementRef,
    inject,
    input,
    InputSignal,
    OnDestroy,
    OnInit,
    Renderer2
} from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MapCanvasComponent } from '../map-canvas/map-canvas.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MapItemBaseComponent } from '../map-item-base/map-item-base.component';
import { Mapgadget } from '../../pages/mapeditors/mapeditors.interface';
import { MapItemType } from '../map-item-base/map-item-base.enum';
import { interval, Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import {
    HostForMapItem,
    MapItemRoot,
    MapItemRootParams,
    ServiceForMapItem
} from '../map-item-base/map-item-base.interface';
import { AngularDraggableModule } from 'angular2-draggable';

@Component({
    selector: 'oitc-trafficlight-item',
    standalone: true,
    imports: [CdkDrag, ContextMenuModule, NgClass, AngularDraggableModule, CdkDragHandle],
    templateUrl: './trafficlight-item.component.html',
    styleUrl: './trafficlight-item.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrafficlightItemComponent extends MapItemBaseComponent<Mapgadget> implements OnInit, OnDestroy {
    public override item: InputSignal<Mapgadget | undefined> = input<Mapgadget>();
    public refreshInterval = input<number>(0);

    private readonly document = inject(DOCUMENT);

    private subscriptions: Subscription = new Subscription();
    private statusUpdateInterval: Subscription = new Subscription();

    protected override type = MapItemType.GADGET;

    protected init: boolean = true;
    protected width: number = 60;
    protected height: number = 150;
    private intervalStartet: boolean = false; // needed to prevent multiple interval subscriptions
    private current_state: number = 0;
    private is_flapping: boolean = false;
    protected Host!: HostForMapItem;
    protected Service!: ServiceForMapItem;
    protected showGreen: boolean = false;
    protected showYellow: boolean = false;
    protected showRed: boolean = false;
    protected showBlue: boolean = false;
    private blink: boolean = false;
    private timer: { [key: string]: any } = {
        red: null,
        yellow: null,
        green: null
    };

    protected lightRadius: number = 0;
    protected lightDiameter: number = 0;
    protected lightPadding: number = 0;
    protected circleX: number = 0;

    protected allowView = true;

    protected container!: ElementRef;
    private svgNamespace = 'http://www.w3.org/2000/svg';

    private svgElement!: SVGElement;

    constructor(parent: MapCanvasComponent, private renderer: Renderer2) {
        super(parent);
        effect(() => {
            this.onObjectIdChange();
            this.onSizeLabelChange();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.stop();
        this.stopBlinking();
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

        const params: MapItemRootParams = {
            'angular': true,
            'disableGlobalLoader': true,
            'objectId': this.item()!.object_id as number,
            'mapId': this.item()!.map_id as number,
            'type': this.item()!.type as string
        };

        this.subscriptions.add(this.MapItemBaseService.getMapItem(params)
            .subscribe({
                    next: (result: MapItemRoot) => {
                        this.current_state = result.data.Servicestatus.currentState;
                        this.is_flapping = result.data.Servicestatus.isFlapping;

                        this.Host = result.data.Host;
                        this.Service = result.data.Service;

                        this.showGreen = false;
                        this.showYellow = false;
                        this.showRed = false;
                        this.showBlue = false;
                        this.blink = false;

                        this.stopBlinking();
                        switch (this.current_state) {
                            case 0:
                                this.showGreen = true;
                                break;
                            case 1:
                                this.showYellow = true;
                                break;
                            case 2:
                                this.showRed = true;
                                break;
                            case 3:
                                this.showGreen = true;
                                this.showYellow = true;
                                this.showRed = true;
                                break;
                            default:
                                this.showBlue = true;
                                break;
                        }

                        if (this.is_flapping) {
                            this.blink = true;
                        }

                        this.renderTrafficlight();

                        this.initRefreshTimer();

                        this.init = false;
                        this.cdr.markForCheck();
                    },
                    error: (err) => {
                        //error handling here
                        this.allowView = false;
                        this.cdr.markForCheck();
                    }
                }
            ));
    };

    private renderTrafficlight() {
        // 17px was the old radius of the static traffic light.
        // We calculate this value on the fly to be able to resize the traffic light

        this.lightDiameter = Math.min(this.width * 0.7, this.height / 3.5);
        this.lightRadius = this.lightDiameter / 2;

        this.lightPadding = (this.height - (3 * this.lightDiameter)) / 4;
        this.circleX = Math.floor(this.width / 2);

        if (this.item() && this.item()?.id) {
            let trafficLightElement = this.document.getElementById('map-trafficlight-' + this.item()?.id);
            if (!this.svgElement) {
                this.svgElement = this.renderer.createElement('svg', this.svgNamespace);
            }
            this.renderer.setAttribute(this.svgElement, 'id', 'traffic-light-' + this.item()!.id);
            this.renderer.setAttribute(this.svgElement, 'width', this.width.toString());
            this.renderer.setAttribute(this.svgElement, 'height', this.height.toString());

            const defs = this.renderer.createElement('defs', this.svgNamespace);
            const createLinearGradient = (id: string, stops: {
                offset: string,
                color: string
            }[], x1: number, y1: number, x2: number, y2: number) => {
                let grad = this.renderer.createElement('linearGradient', this.svgNamespace);
                this.setAttrs(grad, {id: id, x1: x1, y1: y1, x2: x2, y2: y2});
                stops.forEach(s => {
                    const stop = this.renderer.createElement('stop', this.svgNamespace);
                    this.setAttrs(stop, {offset: s.offset, 'stop-color': s.color});
                    this.renderer.appendChild(grad, stop);
                });
                return grad;
            };

            const createRadialGradient = (id: string, stops: {
                offset: string,
                color: string
            }[], cx: number, cy: number, r: number, fx: number, fy: number) => {
                let grad = this.renderer.createElement('radialGradient', this.svgNamespace);
                this.setAttrs(grad, {
                    id: id,
                    cx: cx,
                    cy: cy,
                    r: r,
                    fx: fx,
                    fy: fy,
                    gradientUnits: 'userSpaceOnUse'
                });
                stops.forEach(s => {
                    const stop = this.renderer.createElement('stop', this.svgNamespace);
                    this.setAttrs(stop, {offset: s.offset, 'stop-color': s.color});
                    this.renderer.appendChild(grad, stop);
                });
                return grad;
            };

            const createPattern = (id: string, x: number, y: number, width: number, height: number) => {
                let grad = this.renderer.createElement('pattern', this.svgNamespace);
                this.setAttrs(grad, {
                    id: id,
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    patternUnits: 'userSpaceOnUse'
                });
                return grad;
            };

            const tlBg = createLinearGradient('tlBg_' + this.item()!.id, [
                {offset: '0.02', color: '#323232'},
                {offset: '0.03', color: '#333333'},
                {offset: '0.3', color: '#323232'},
            ], 0, 0, 0, 1);
            this.renderer.appendChild(defs, tlBg);

            const protectorGradient = createLinearGradient('protectorGradient_' + this.item()!.id, [
                {offset: '0', color: '#555555'},
                {offset: '0.03', color: '#444444'},
                {offset: '0.07', color: '#333333'},
                {offset: '0.12', color: '#222222'}
            ], 0, 0, 0, 1);
            this.renderer.appendChild(defs, protectorGradient);

            const redLight = createRadialGradient('redLight_' + this.item()!.id, [
                {offset: '0%', color: 'brown'},
                {offset: '25%', color: 'transparent'}
            ], 1, 1, 4, 0, 0);
            this.renderer.appendChild(defs, redLight);

            const yellowLight = createRadialGradient('yellowLight_' + this.item()!.id, [
                {offset: '0%', color: 'orange'},
                {offset: '25%', color: 'transparent'}
            ], 1, 1, 4, 0, 0);
            this.renderer.appendChild(defs, yellowLight);

            const greenLight = createRadialGradient('greenLight_' + this.item()!.id, [
                {offset: '0%', color: 'lime'},
                {offset: '25%', color: 'transparent'}
            ], 1, 1, 4, 0, 0);
            this.renderer.appendChild(defs, greenLight);


            const redLightPattern = createPattern('redLightPattern_' + this.item()!.id, 0, 0, 3, 3);
            const redLightCircle = this.renderer.createElement('circle', this.svgNamespace);
            this.setAttrs(redLightCircle, {
                cx: 1,
                cy: 1,
                r: 3,
                fill: `url(#redLight_${this.item()!.id})`
            });
            this.renderer.appendChild(redLightPattern, redLightCircle);
            this.renderer.appendChild(defs, redLightPattern);

            const yellowLightPattern = createPattern('yellowLightPattern_' + this.item()!.id, 0, 0, 3, 3);
            const yellowLightCircle = this.renderer.createElement('circle', this.svgNamespace);
            this.setAttrs(yellowLightCircle, {
                cx: 1,
                cy: 1,
                r: 3,
                fill: `url(#yellowLight_${this.item()!.id})`
            });
            this.renderer.appendChild(yellowLightPattern, yellowLightCircle);
            this.renderer.appendChild(defs, yellowLightPattern);


            const greenLightPattern = createPattern('greenLightPattern_' + this.item()!.id, 0, 0, 3, 3);
            const greenLightCircle = this.renderer.createElement('circle', this.svgNamespace);
            this.setAttrs(greenLightCircle, {
                cx: 1,
                cy: 1,
                r: 3,
                fill: `url(#greenLight_${this.item()!.id})`
            });
            this.renderer.appendChild(greenLightPattern, greenLightCircle);
            this.renderer.appendChild(defs, greenLightPattern);
            this.renderer.appendChild(this.svgElement, defs);

            const rect = this.renderer.createElement('rect', this.svgNamespace);
            this.setAttrs(rect, {
                width: this.width,
                height: this.height,
                rx: 10, ry: 10,
                fill: `url(#tlBg_${this.item()!.id})`,
                stroke: '#444',
                'stroke-width': 2
            });
            this.renderer.appendChild(this.svgElement, rect);

            if (this.item()?.show_label) {
                const text = this.renderer.createElement('text', this.svgNamespace);
                const label = `${this.Host.hostname}/${this.Service.servicename}`;
                const textNode = this.renderer.createText(label);

                this.setAttrs(text, {
                    x: 0,
                    y: this.height - 10,
                    'font-size': this.height / 20,
                    'font-family': 'Verdana',
                    fill: '#FFF',
                    transform: `rotate(-90, 0, ${this.height - 10 - (this.width / 8)})`
                });
                this.renderer.appendChild(text, textNode);
                this.renderer.appendChild(this.svgElement, text);
            }

            const lightsGroup = this.renderer.createElement('g', this.svgNamespace);
            this.renderer.setAttribute(lightsGroup, 'id', 'lights_' + this.item()!.id);

            const redGroup = this.renderer.createElement('g', this.svgNamespace);
            this.setAttrs(
                redGroup,
                {
                    id: `redLightGroup_${this.item()!.id}`
                }
            );
            const redCircle = this.renderer.createElement('circle', this.svgNamespace);
            this.setAttrs(redCircle, {
                cx: this.circleX,
                cy: this.lightPadding + this.lightRadius,
                r: this.lightRadius,
                fill: `url(#redLightPattern_${this.item()!.id})`,
                stroke: '#444',
                'stroke-width': 2
            });
            if (this.showRed) {
                const circle = this.renderer.createElement('circle', 'svg');
                this.setAttrs(circle, {
                    id: 'redLightCircle_' + this.id,
                    cx: this.circleX,
                    cy: this.lightPadding + this.lightRadius,
                    r: this.lightRadius,
                    fill: '#f00',
                });
                if (this.blink) {
                    this.blinking(circle, 'red');
                }
                this.renderer.appendChild(redGroup, circle);
            }
            this.renderer.appendChild(redGroup, redCircle);
            this.renderer.appendChild(lightsGroup, redGroup);

            const yellowGroup = this.renderer.createElement('g', this.svgNamespace);
            this.setAttrs(
                yellowGroup,
                {
                    id: `yellowLightGroup_${this.item()!.id}`
                }
            );
            const yellowCircle = this.renderer.createElement('circle', this.svgNamespace);
            this.setAttrs(yellowCircle, {
                cx: this.circleX,
                cy: this.lightDiameter + this.lightPadding * 2 + this.lightRadius,
                r: this.lightRadius,
                fill: `url(#yellowLightPattern_${this.item()!.id})`,
                stroke: '#444',
                'stroke-width': 2
            });
            if (this.showYellow) {
                const circle = this.renderer.createElement('circle', 'svg');
                this.setAttrs(circle, {
                    id: 'yellowLightCircle_' + this.id,
                    cx: this.circleX,
                    cy: this.lightDiameter + this.lightPadding * 2 + this.lightRadius,
                    r: this.lightRadius,
                    fill: '#FFFF00',
                });
                if (this.blink) {
                    this.blinking(circle, 'yellow');
                }
                this.renderer.appendChild(yellowGroup, circle);

            }
            this.renderer.appendChild(yellowGroup, yellowCircle);
            this.renderer.appendChild(lightsGroup, yellowGroup);

            const greenGroup = this.renderer.createElement('g', this.svgNamespace);
            this.setAttrs(
                greenGroup,
                {
                    id: `greenLightGroup_${this.item()!.id}`
                }
            );
            const greenCircle = this.renderer.createElement('circle', this.svgNamespace);
            this.setAttrs(greenCircle, {
                cx: this.circleX,
                cy: this.lightDiameter * 2 + this.lightPadding * 3 + this.lightRadius,
                r: this.lightRadius,
                fill: `url(#greenLightPattern_${this.item()!.id})`,
                stroke: '#444',
                'stroke-width': 2
            });
            if (this.showGreen) {
                const circle = this.renderer.createElement('circle', 'svg');
                this.setAttrs(circle, {
                    id: 'greenLightCircle_' + this.id,
                    cx: this.circleX,
                    cy: this.lightDiameter * 2 + this.lightPadding * 3 + this.lightRadius,
                    r: this.lightRadius,
                    fill: '#0F0',
                });
                if (this.blink) {
                    this.blinking(circle, 'green');
                }
                this.renderer.appendChild(greenGroup, circle);
            }

            this.renderer.appendChild(greenGroup, greenCircle);
            this.renderer.appendChild(lightsGroup, greenGroup);

            if (this.showBlue) {
                const blueGroup = this.renderer.createElement('g', this.svgNamespace);
                this.setAttrs(
                    blueGroup,
                    {
                        id: `blueLightGroup_${this.item()!.id})`
                    }
                );
                const blueCircle = this.renderer.createElement('circle', this.svgNamespace);
                this.setAttrs(blueCircle, {
                    cx: this.circleX,
                    cy: this.lightDiameter + this.lightPadding * 2 + this.lightRadius,
                    r: this.lightRadius,
                    fill: '#6e99ff'
                });
                this.renderer.appendChild(blueGroup, blueCircle);
                this.renderer.appendChild(lightsGroup, blueGroup);
            }
            this.renderer.appendChild(this.svgElement, lightsGroup);
            this.renderer.appendChild(trafficLightElement, this.svgElement);
            this.cdr.markForCheck();
        }
    };

    private setAttrs(el: any, attrs: { [key: string]: string | number }) {
        Object.keys(attrs).forEach(key => {
            this.renderer.setAttribute(el, key, attrs[key].toString());
        });
    }


    private blinking(el: HTMLElement, color: string) {
        //set the animation interval high to prevent high CPU usage
        //the animation isnt that smooth anymore but the browser need ~70% less CPU!

        //$.fx.interval = 100;

        if (this.timer[color] !== null) {
            clearInterval(this.timer[color]);
            this.timer[color] = null;
        }

        this.timer[color] = setInterval(() => {
            this.renderer.setStyle(el, 'opacity', '0');
            this.renderer.setStyle(el, 'visibility', 'hidden');
            this.renderer.setStyle(el, 'transition', 'visibility 0s 1.6s, opacity 1.6s linear');
            setTimeout(() => {
                this.renderer.setStyle(el, 'opacity', '1');
                this.renderer.setStyle(el, 'visibility', 'visible');
                this.renderer.setStyle(el, 'transition', 'opacity 2s linear');
            }, 2000);
        }, 6000);
    };

    private stopBlinking() {
        for (let i in this.timer) {
            if (this.timer[i] !== null) {
                clearInterval(this.timer[i]);
                this.timer[i] = null;
            }
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

    private onSizeLabelChange() {
        if (this.init) {
            return;
        }

        this.width = this.item()!.size_x - 10; //The view adds 10px
        this.height = this.item()!.size_y - 10;
        this.renderTrafficlight();
        this.cdr.markForCheck();
    }

    private onObjectIdChange() {
        if (this.init || this.item()!.object_id === null) {
            //Avoid ajax error if user search a service in Gadget config modal
            return;
        }

        this.load();
    }
}
