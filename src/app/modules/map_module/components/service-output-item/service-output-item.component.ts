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
import { ServiceOutputItemService } from './service-output-item.service';
import { Host, Service, ServiceOutputItemRoot, ServiceOutputItemRootParams } from './service-output-item.interface';
import { ResizableDirective } from '../../../../directives/resizable.directive';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { TrustAsHtmlPipe } from '../../../../pipes/trust-as-html.pipe';

@Component({
    selector: 'oitc-service-output-item',
    standalone: true,
    imports: [CdkDrag, ContextMenuModule, CdkDragHandle, ResizableDirective, NgIf, NgStyle, NgClass, TrustAsHtmlPipe],
    templateUrl: './service-output-item.component.html',
    styleUrl: './service-output-item.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceOutputItemComponent extends MapItemBaseComponent<Mapgadget> implements OnInit, OnDestroy {

    public override item: InputSignal<Mapgadget | undefined> = input<Mapgadget>();
    public refreshInterval = input<number>(0);

    private subscriptions: Subscription = new Subscription();
    private readonly ServiceOutputItemService = inject(ServiceOutputItemService);
    private statusUpdateInterval: Subscription = new Subscription();

    protected override type = MapItemType.GADGET;

    protected init: boolean = true;
    protected width: number = 60;
    protected height: number = 150;
    protected color: string = "";
    private current_state: number = 0;
    private is_flapping: boolean = false;
    private intervalStartet: boolean = false; // needed to prevent multiple interval subscriptions
    private Host!: Host;
    protected Service!: Service;
    protected allowView: boolean = false;
    protected output: string = "";
    private longOutputHtml: string | null = null;

    constructor(parent: MapCanvasComponent) {
        super(parent);
        effect(() => {
            this.onSizeXShowLabelOutputTypeChange();
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
        }
        if (this.item()!.size_y > 0) {
            this.height = this.item()!.size_y;
        }

        this.load();
    }

    private load() {

        const params: ServiceOutputItemRootParams = {
            'angular': true,
            'disableGlobalLoader': true,
            'objectId': this.item()!.object_id as number,
            'mapId': this.item()!.map_id as number,
            'type': this.item()!.type as string,
            'includeServiceOutput': true
        };

        this.subscriptions.add(this.ServiceOutputItemService.getServiceOutputItem(params)
            .subscribe((result: ServiceOutputItemRoot) => {
                this.current_state = result.data.Servicestatus.currentState;
                this.is_flapping = result.data.Servicestatus.isFlapping;

                this.Host = result.data.Host;
                this.Service = result.data.Service;
                this.allowView = result.allowView;
                this.color = result.data.color;

                this.output = result.data.Servicestatus.output;
                this.longOutputHtml = result.data.Servicestatus.longOutputHtml;

                this.renderOutput();

                this.initRefreshTimer();

                this.init = false;
                this.cdr.markForCheck();
            }));
    };

    private renderOutput() {

        if (this.item()!.output_type !== 'service_output') {
            if (this.longOutputHtml !== null) {
                this.output = this.longOutputHtml;
                this.cdr.markForCheck();
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

    private onSizeXShowLabelOutputTypeChange() {
        if (this.init) {
            return;
        }

        this.width = this.item()!.size_x;
        this.height = this.item()!.size_y;
        this.cdr.markForCheck();
        this.renderOutput();
    }

    private onObjectIdChange() {
        if (this.init || this.item()!.object_id === null) {
            //Avoid ajax error if user search a service in Gadget config modal
            return;
        }

        this.load();
    }

}
