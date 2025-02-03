import {
    ChangeDetectionStrategy,
    Component,
    effect,
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
import { Mapgadget } from '../../pages/mapeditors/Mapeditors.interface';
import { MapItemType } from '../map-item-base/map-item-base.enum';
import { interval, Subscription } from 'rxjs';
import { TachoItemService } from './tacho-item.service';
import { Host, Perfdata, Service, Setup, TachoItemRoot, TachoItemRootParams } from './tacho-item.interface';
import { ResizableDirective } from '../../../../directives/resizable.directive';
import { DOCUMENT, NgIf } from '@angular/common';
import { RadialGauge } from 'canvas-gauges';

@Component({
    selector: 'oitc-tacho-item',
    standalone: true,
    imports: [CdkDrag, ContextMenuModule, CdkDragHandle, ResizableDirective, NgIf],
    templateUrl: './tacho-item.component.html',
    styleUrl: './tacho-item.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TachoItemComponent extends MapItemBaseComponent<Mapgadget> implements OnInit, OnDestroy {
    public override item: InputSignal<Mapgadget | undefined> = input<Mapgadget>();
    public refreshInterval = input<number>(0);

    private readonly document = inject(DOCUMENT);

    private subscriptions: Subscription = new Subscription();
    private readonly TachoItemService = inject(TachoItemService);
    private statusUpdateInterval: Subscription = new Subscription();

    protected override type = MapItemType.GADGET;

    // default data if no setup is passed whatsoever.
    private defaultSetup: Setup = {
        scale: {
            min: 0,
            max: 100,
            type: "O",
        },
        metric: {
            value: 0,
            unit: 'X',
            name: 'No data available',
        },
        warn: {
            low: null,
            high: null,
        },
        crit: {
            low: null,
            high: null,
        }
    };

    protected init: boolean = true;
    protected width: number = 200;
    protected height: number = this.width;
    private intervalStartet: boolean = false; // needed to prevent multiple interval subscriptions
    protected Host!: Host;
    protected Service!: Service;
    private responsePerfdata!: Perfdata;
    private color: string = '';
    private setup!: Setup;

    constructor(parent: MapCanvasComponent, private renderer: Renderer2) {
        super(parent);
        effect(() => {
            this.onSizeXShowLabelChange();
            this.onMetricChange();
            this.onObjectIdChange();
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
            this.height = this.width;
        }
        if (this.item()!.size_y > 0) {
            this.width = this.item()!.size_y;
            this.height = this.width;
        }

        this.load();
    }

    private load() {

        const params: TachoItemRootParams = {
            'angular': true,
            'disableGlobalLoader': true,
            'objectId': this.item()!.object_id as number,
            'mapId': this.item()!.map_id as number,
            'type': this.item()!.type as string
        };

        this.subscriptions.add(this.TachoItemService.getTachoItem(params)
            .subscribe((result: TachoItemRoot) => {
                this.color = result.data.color;
                this.Host = result.data.Host;
                this.Service = result.data.Service;
                this.responsePerfdata = result.data.Perfdata;

                this.processPerfdata();
                this.renderGauge();

                this.initRefreshTimer();
                this.init = false;
                this.cdr.markForCheck();
            }));
    };

    private getThresholdAreas(setup: Setup) {
        let thresholdAreas: any[] = [];
        switch (setup.scale.type) {
            case "W<O":
                thresholdAreas = [
                    {from: setup.crit.low, to: setup.warn.low, color: '#DF8F1D'},
                    {from: setup.warn.low, to: setup.scale.max, color: '#449D44'}
                ];
                break;
            case "C<W<O":
                thresholdAreas = [
                    {from: setup.scale.min, to: setup.crit.low, color: '#C9302C'},
                    {from: setup.crit.low, to: setup.warn.low, color: '#DF8F1D'},
                    {from: setup.warn.low, to: setup.scale.max, color: '#449D44'}
                ];
                break;
            case "O<W":
                thresholdAreas = [
                    {from: setup.scale.min, to: setup.warn.low, color: '#449D44'},
                    {from: setup.warn.low, to: setup.scale.max, color: '#DF8F1D'}
                ];
                break;
            case "O<W<C":
                thresholdAreas = [
                    {from: setup.scale.min, to: setup.warn.low, color: '#449D44'},
                    {from: setup.warn.low, to: setup.crit.low, color: '#DF8F1D'},
                    {from: setup.crit.low, to: setup.scale.max, color: '#C9302C'}
                ];
                break;
            case "C<W<O<W<C":
                thresholdAreas = [
                    {from: setup.scale.min, to: setup.crit.low, color: '#C9302C'},
                    {from: setup.crit.low, to: setup.warn.low, color: '#DF8F1D'},
                    {from: setup.warn.low, to: setup.warn.high, color: '#449D44'},
                    {from: setup.warn.high, to: setup.crit.high, color: '#DF8F1D'},
                    {from: setup.crit.high, to: setup.scale.max, color: '#C9302C'}
                ];
                break;
            case "O<W<C<W<O":
                thresholdAreas = [
                    {from: setup.scale.min, to: setup.crit.low, color: '#449D44'},
                    {from: setup.crit.low, to: setup.warn.low, color: '#DF8F1D'},
                    {from: setup.warn.low, to: setup.warn.high, color: '#C9302C'},
                    {from: setup.warn.high, to: setup.crit.high, color: '#DF8F1D'},
                    {from: setup.crit.high, to: setup.scale.max, color: '#449D44'}
                ];
                break;
            case "O":
            default:
                break;
        }
        return thresholdAreas;
    }

    private renderGauge() {
        let setup = this.setup;
        let units = setup.metric.unit;
        let label = setup.metric.name;

        if (label.length > 20) {
            label = label.substr(0, 20);
            label += '...';
        }

        if (this.item()!.show_label === true) {
            if (units === null) {
                units = label;
            } else {
                units = label + ' in ' + units;
            }
            label = this.Host.hostname + '/' + this.Service.servicename;
            if (label.length > 20) {
                label = label.substr(0, 20);
                label += '...';
            }
        }

        if (isNaN(setup.scale.min) || isNaN(setup.scale.max) || setup.scale.min === null || setup.scale.max === null) {
            setup.scale.min = 0;
            setup.scale.max = 100;
        }

        let thresholds = this.getThresholdAreas(setup);

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
            renderTo: 'map-tacho-' + this.item()!.id,
            height: this.height,
            width: this.width,
            value: setup.metric.value,
            minValue: setup.scale.min || 0,
            maxValue: setup.scale.max || 100,
            units: units,
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

    private processPerfdata() {
        // default data if no setup is passed whatsoever.
        this.setup = this.defaultSetup;


        if (this.responsePerfdata !== null) {
            if (this.item()!.metric !== null && this.responsePerfdata.hasOwnProperty(this.item()!.metric)) {
                this.setup = this.responsePerfdata[this.item()!.metric].datasource.setup;
            } else {
                //Use first metric.
                for (let metricName in this.responsePerfdata) {
                    this.setup = this.responsePerfdata[metricName].datasource.setup;
                    break;
                }
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

    private onSizeXShowLabelChange() {
        if (this.init) {
            return;
        }

        this.width = this.item()!.size_x;
        this.height = this.width;

        this.renderGauge();
    }

    private onMetricChange() {
        if (this.init) {
            return;
        }

        this.processPerfdata();
        this.renderGauge();
    }

    private onObjectIdChange() {
        if (this.init || this.item()!.object_id === null) {
            //Avoid ajax error if user search a service in Gadget config modal
            return;
        }

        this.load();
    }

}
