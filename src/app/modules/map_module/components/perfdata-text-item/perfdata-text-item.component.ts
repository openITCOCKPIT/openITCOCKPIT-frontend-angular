import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    input,
    InputSignal,
    OnDestroy,
    OnInit
} from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MapCanvasComponent } from '../map-canvas/map-canvas.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MapItemBaseComponent } from '../map-item-base/map-item-base.component';
import { Mapgadget } from '../../pages/mapeditors/Mapeditors.interface';
import { MapItemType } from '../map-item-base/map-item-base.enum';
import { interval, Subscription } from 'rxjs';
import { PerfdataTextItemService } from './perfdata-text-item.service';
import {
    Load1,
    Load15,
    Load5,
    Perfdata,
    PerfdataTextItemRoot,
    PerfdataTextItemRootParams
} from './perfdata-text-item.interface';
import { ResizableDirective } from '../../../../directives/resizable.directive';
import { NgIf } from '@angular/common';

@Component({
    selector: 'oitc-perfdata-text-item',
    standalone: true,
    imports: [CdkDrag, ContextMenuModule, CdkDragHandle, ResizableDirective, NgIf],
    templateUrl: './perfdata-text-item.component.html',
    styleUrl: './perfdata-text-item.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerfdataTextItemComponent extends MapItemBaseComponent<Mapgadget> implements OnInit, OnDestroy {

    public override item: InputSignal<Mapgadget | undefined> = input<Mapgadget>();
    public refreshInterval = input<number>(0);

    private subscriptions: Subscription = new Subscription();
    private readonly PerfdataTextItemService = inject(PerfdataTextItemService);
    private statusUpdateInterval: Subscription = new Subscription();

    protected override type = MapItemType.GADGET;

    protected init: boolean = true;
    protected width: number = 0;
    protected height: number = 0;
    private responsePerfdata!: Perfdata;
    protected color: string = "";
    protected text: string = "";
    private perfdataName: string = "";
    private perfdata!: Load1 | Load5 | Load15;
    private intervalStartet: boolean = false; // needed to prevent multiple interval subscriptions

    constructor(parent: MapCanvasComponent) {
        super(parent);
        effect(() => {
            this.onSizeLabelMetricChange();
            this.onObjectIdChange();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.stop();
    }

    public ngOnInit(): void {
        this.load();
    }

    private load() {

        const params: PerfdataTextItemRootParams = {
            'angular': true,
            'disableGlobalLoader': true,
            'objectId': this.item()!.object_id as number,
            'mapId': this.item()!.map_id as number,
            'type': this.item()!.type as string
        };

        this.subscriptions.add(this.PerfdataTextItemService.getPerfdataTextItem(params)
            .subscribe((result: PerfdataTextItemRoot) => {
                this.responsePerfdata = result.data.Perfdata;

                switch (result.data.color) {
                    case 'txt-color-green':
                        this.color = '#356e35';
                        break;

                    case 'warning':
                        this.color = '#DF8F1D';
                        break;

                    case 'txt-color-red':
                        this.color = '#a90329';
                        break;

                    case 'txt-color-blueDark':
                        this.color = '#4c4f53';
                        break;

                    default:
                        this.color = '#337ab7'; //text-primary
                        break;
                }

                this.processPerfdata();

                /*
                setTimeout(function(){
                    //Resolve strange resize bug on draggable
                    var $mapPerfdatatext = $('#map-perfdatatext-'+$scope.item.id);
                    $scope.width = $mapPerfdatatext.width();
                    $scope.height = $mapPerfdatatext.height();

                }, 150);*/
                this.initRefreshTimer();

                this.init = false;
                this.cdr.markForCheck();
            }));
    };

    private processPerfdata() {

        if (this.responsePerfdata !== null) {
            const metric = this.item()!.metric as keyof Perfdata;
            if (this.item()!.metric !== null && this.responsePerfdata.hasOwnProperty(metric)) {
                this.perfdataName = metric;
                this.perfdata = this.responsePerfdata[metric];
            } else {
                //Use first metric.
                for (let metricName in this.responsePerfdata) {
                    this.perfdataName = metricName as keyof Perfdata;
                    this.perfdata = this.responsePerfdata[metricName as keyof Perfdata];
                    break;
                }
            }
        }

        if (this.perfdata) {
            let text = this.perfdata.current;
            if (this.perfdata.unit !== null && this.perfdata.unit !== '') {
                text = text + ' ' + this.perfdata.unit;
            }

            if (this.item()!.show_label) {
                text = this.perfdataName + ' ' + text;
            }

            if (this.width <= 0) {
                this.width = text.length * 11;
            }

            if (this.height <= 0) {
                this.height = 18;
            }

            this.text = text;
            this.width = this.item()!.size_x;
            this.height = this.item()!.size_y;
            this.cdr.markForCheck();
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

    private onSizeLabelMetricChange() {
        if (this.init) {
            return;
        }

        this.processPerfdata();
        this.width = this.item()!.size_x;
        this.height = this.item()!.size_y;
    }

    private onObjectIdChange() {
        if (this.init || this.item()!.object_id === null) {
            //Avoid ajax error if user search a service in Gadget config modal
            return;
        }

        this.load();
    }

}
