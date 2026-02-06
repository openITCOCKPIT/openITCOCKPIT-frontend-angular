import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    input,
    OnDestroy,
    Renderer2,
    ViewChild,
    DOCUMENT
} from '@angular/core';


@Component({
    selector: 'oitc-trafficlight-svg',
    imports: [],
    templateUrl: './trafficlight-svg.component.html',
    styleUrl: './trafficlight-svg.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrafficlightSvgComponent implements OnDestroy {

    @ViewChild('redLightGroup') redLightGroupElement!: ElementRef;
    @ViewChild('yellowLightGroup') yellowLightGroupElement!: ElementRef;
    @ViewChild('greenLightGroup') greenLightGroupElement!: ElementRef;


    public id = input<string | number>('unique-id-123');
    public currentState = input<0 | 1 | 2 | 3 | number | undefined>(undefined);
    public isFlapping = input<boolean>(false);
    public showLabel = input<boolean>(false);
    public label = input<string>('');

    protected width: number = 60;
    protected height: number = 150;

    protected lightRadius: number = 0;
    protected lightDiameter: number = 0;
    protected lightPadding: number = 0;
    protected circleX: number = 0;

    protected showGreen: boolean = false;
    protected showYellow: boolean = false;
    protected showRed: boolean = false;
    protected showBlue: boolean = false;

    private interval: { [key: string]: any } = {
        red: null,
        yellow: null,
        green: null
    };

    private readonly document = inject(DOCUMENT);

    private cdr = inject(ChangeDetectorRef);

    constructor(private renderer: Renderer2) {
        afterRenderEffect(() => {
            this.renderTrafficlight();
        });
    }

    public ngOnDestroy(): void {
        this.stopBlinking();
    }

    private renderTrafficlight() {
        this.cdr

        this.showGreen = false;
        this.showYellow = false;
        this.showRed = false;
        this.showBlue = false;

        this.stopBlinking();
        switch (this.currentState()) {
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


        // 17px was the old radius of the static traffic light.
        // We calucate this value on the fly to be able to resize the traffic light
        this.lightRadius = Math.floor(this.width * (17 / 60));
        this.lightDiameter = (this.lightRadius * 2) + 2; //2 is the stroke width
        this.lightPadding = Math.ceil((this.height - this.lightDiameter * 3) / 4);
        this.circleX = Math.floor(this.width / 2);

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
            const greenLightGroup = this.greenLightGroupElement.nativeElement;
            this.renderer.insertBefore(greenLightGroup, circle, greenLightGroup.firstChild);
        }

        let redLightElement = this.document.getElementById('redLightCircle_' + this.id) as HTMLElement;
        let yellowLightElement = this.document.getElementById('yellowLightCircle_' + this.id) as HTMLElement;
        let greenLightElement = this.document.getElementById('greenLightCircle_' + this.id) as HTMLElement;
        if (this.showRed && this.isFlapping() && redLightElement) {
            this.blinking(redLightElement, 'red');
        }
        if (this.showYellow && this.isFlapping() && yellowLightElement) {
            this.blinking(yellowLightElement, 'yellow');
        }
        if (this.showGreen && this.isFlapping() && greenLightElement) {
            this.blinking(greenLightElement, 'green');
        }

        this.cdr.markForCheck();
    };

    private blinking(el: HTMLElement, color: string) {
        //set the animation interval high to prevent high CPU usage
        //the animation isn't that smooth anymore but the browser need ~70% less CPU!

        if (this.interval[color] !== null) {
            clearInterval(this.interval[color]);
            this.interval[color] = null;
        }

        this.interval[color] = setInterval(() => {
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
        for (let i in this.interval) {
            if (this.interval[i] !== null) {
                clearInterval(this.interval[i]);
                this.interval[i] = null;
            }
        }
    };
}
