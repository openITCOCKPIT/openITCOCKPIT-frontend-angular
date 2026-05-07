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
    Renderer2,
    ViewChild
} from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MapCanvasComponent } from '../map-canvas/map-canvas.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MapItemBaseComponent } from '../map-item-base/map-item-base.component';
import { Mapgadget } from '../../pages/mapeditors/mapeditors.interface';
import { MapItemType } from '../map-item-base/map-item-base.enum';
import { interval, Subscription } from 'rxjs';
import { ResizableDirective } from '../../../../directives/resizable.directive';
import { NgClass } from '@angular/common';
import {
    HostForMapItem,
    MapItemRoot,
    MapItemRootParams,
    ServiceForMapItem
} from '../map-item-base/map-item-base.interface';

@Component({
    selector: 'oitc-trafficlight-item',
    standalone: true,
    imports: [CdkDrag, ContextMenuModule, CdkDragHandle, ResizableDirective, NgClass],
    templateUrl: './trafficlight-item.component.html',
    styleUrl: './trafficlight-item.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrafficlightItemComponent extends MapItemBaseComponent<Mapgadget> implements OnInit, OnDestroy {
    @ViewChild('redLightGroup') redLightGroupElement!: ElementRef;
    @ViewChild('yellowLightGroup') yellowLightGroupElement!: ElementRef;
    @ViewChild('greenLightGroup') greenLightGroupElement!: ElementRef;
    @ViewChild(ResizableDirective) resizableDirective!: ResizableDirective;

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
    private myCircle: any;


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
                        if (this.resizableDirective) {
                            this.resizableDirective.setLastWidthHeight(this.item()!.size_x, this.item()!.size_y);
                        }
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
        // We calucate this value on the fly to be able to resize the traffic light
        this.lightRadius = Math.floor(this.width * (17 / 60));
        this.lightDiameter = (this.lightRadius * 2) + 2; //2 is the stroke width
        this.lightPadding = Math.ceil((this.height - this.lightDiameter * 3) / 4);
        this.circleX = Math.floor(this.width / 2);
        if (this.item() && this.item()?.id) {
            let trafficLightElement = this.document.getElementById('map-trafficlight-' + this.item()?.id);
            // 1. SVG Root-Element
            const svg = this.renderer.createElement('svg', this.svgNamespace);
            this.renderer.setAttribute(svg, 'id', 'traffic-light-' + this.item()!.id);
            this.renderer.setAttribute(svg, 'width', this.width.toString());
            this.renderer.setAttribute(svg, 'height', this.height.toString());


            const itemId = this.item()!.id;

            // 1. Defs-Bereich erstellen
            const defs = this.renderer.createElement('defs', this.svgNamespace);

// Beispiel: Ein LinearGradient erstellen
            const createLinearGradient = (id: string, stops: { offset: string, color: string }[]) => {
                const grad = this.renderer.createElement('linearGradient', this.svgNamespace);
                this.setAttrs(grad, {id: id, x1: 0, y1: 0, x2: 0, y2: 1});

                stops.forEach(s => {
                    const stop = this.renderer.createElement('stop', this.svgNamespace);
                    this.setAttrs(stop, {offset: s.offset, 'stop-color': s.color});
                    this.renderer.appendChild(grad, stop);
                });
                return grad;
            };

// Gradient hinzufügen
            const tlBg = createLinearGradient('tlBg_' + itemId, [
                {offset: '0.02', color: '#323232'},
                {offset: '0.3', color: '#323232'}
            ]);
            this.renderer.appendChild(defs, tlBg);

            // 2. Das Haupt-Rechteck (Body)
            const rect = this.renderer.createElement('rect', this.svgNamespace);
            this.setAttrs(rect, {
                width: this.width,
                height: this.height,
                rx: 10, ry: 10,
                fill: `url(#tlBg_${itemId})`,
                stroke: '#444',
                'stroke-width': 2
            });

// 3. Text (Bedingt hinzufügen)
            if (this.item()?.show_label) {
                const text = this.renderer.createElement('text', this.svgNamespace);
                const label = `${this.Host.hostname}/${this.Service.servicename}`;
                const textNode = this.renderer.createText(label);

                this.setAttrs(text, {
                    x: 0,
                    y: this.height - 10,
                    'font-size': this.width / 8,
                    'font-family': 'Verdana',
                    fill: '#FFF',
                    transform: `rotate(-90, 0, ${this.height - 10 - (this.width / 8)})`
                });
                this.renderer.appendChild(text, textNode);
                this.renderer.appendChild(svg, text); // svg ist dein Root-Element
            }

// 4. Gruppen und Kreise (Lights)
            const lightsGroup = this.renderer.createElement('g', this.svgNamespace);
            this.renderer.setAttribute(lightsGroup, 'id', 'lights_' + itemId);

            const redGroup = this.renderer.createElement('g', this.svgNamespace);
            const redCircle = this.renderer.createElement('circle', this.svgNamespace);
            this.setAttrs(redCircle, {
                cx: this.circleX,
                cy: this.lightPadding + this.lightRadius,
                r: this.lightRadius,
                fill: `url(#redLightPattern_${itemId})`,
                stroke: '#444',
                'stroke-width': 2
            });
            this.renderer.appendChild(redGroup, redCircle);
            this.renderer.appendChild(lightsGroup, redGroup);

// Am Ende alles an den Root-SVG anfügen
            this.renderer.appendChild(svg, defs);
            this.renderer.appendChild(svg, rect);
            this.renderer.appendChild(svg, lightsGroup);

            if (this.showRed) {
                const circle = this.renderer.createElement('circle', 'svg');
                this.renderer.setAttribute(circle, 'cx', this.circleX.toString());
                this.renderer.setAttribute(circle, 'cy', (this.lightPadding + this.lightRadius).toString());
                this.renderer.setAttribute(circle, 'r', this.lightRadius.toString());
                this.renderer.setAttribute(circle, 'fill', '#f00');
                this.renderer.setAttribute(circle, 'id', 'redLightCircle_' + this.id);
                const redLightGroup = this.redLightGroupElement.nativeElement;
                this.renderer.insertBefore(redLightGroup, circle, redLightGroup.firstChild);
            }

            if (this.showYellow) {
                const circle = this.renderer.createElement('circle', 'svg');
                this.renderer.setAttribute(circle, 'cx', this.circleX.toString());
                this.renderer.setAttribute(circle, 'cy', (this.lightDiameter + this.lightPadding * 2 + this.lightRadius).toString());
                this.renderer.setAttribute(circle, 'r', this.lightRadius.toString());
                this.renderer.setAttribute(circle, 'fill', '#FFFF00');
                this.renderer.setAttribute(circle, 'id', 'yellowLightCircle_' + this.id);
                const yellowLightGroup = this.yellowLightGroupElement.nativeElement;
                this.renderer.insertBefore(yellowLightGroup, circle, yellowLightGroup.firstChild);
            }

            if (this.showGreen) {
                const circle = this.renderer.createElement('circle', 'svg');
                this.renderer.setAttribute(circle, 'cx', this.circleX.toString());
                this.renderer.setAttribute(circle, 'cy', (this.lightDiameter * 2 + this.lightPadding * 3 + this.lightRadius).toString());
                this.renderer.setAttribute(circle, 'r', this.lightRadius.toString());
                this.renderer.setAttribute(circle, 'fill', '#0F0');
                this.renderer.setAttribute(circle, 'id', 'greenLightCircle_' + this.id)
                //const greenLightGroup = this.greenLightGroupElement.nativeElement;
                //this.renderer.insertBefore(greenLightGroup, circle, greenLightGroup.firstChild);
            }

            let redLightElement = this.document.getElementById('redLightCircle_' + this.id) as HTMLElement;
            let yellowLightElement = this.document.getElementById('yellowLightCircle_' + this.id) as HTMLElement;
            let greenLightElement = this.document.getElementById('greenLightCircle_' + this.id) as HTMLElement;
            if (this.showRed && this.blink && redLightElement) {
                this.blinking(redLightElement, 'red');
            }
            if (this.showYellow && this.blink && yellowLightElement) {
                this.blinking(yellowLightElement, 'yellow');
            }
            if (this.showGreen && this.blink && greenLightElement) {
                this.blinking(greenLightElement, 'green');
            }

            // 3. Add svg to div
            //this.renderer.appendChild(svg, rect);

            this.renderer.appendChild(trafficLightElement, svg);
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
