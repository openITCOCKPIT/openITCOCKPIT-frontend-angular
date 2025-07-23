import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    input,
    model,
    OnDestroy,
    output
} from '@angular/core';
import { FFlowModule } from '@foblex/flow';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { NgClass } from '@angular/common';
import { ColComponent, RowComponent, TooltipDirective } from '@coreui/angular';
import { BlockLoaderComponent } from '../../../../layouts/primeng/loading/block-loader/block-loader.component';
import { BadgeOutlineComponent } from '../../../../layouts/coreui/badge-outline/badge-outline.component';
import { OcTreeNode } from '../../organizational-charts-editor/organizational-charts-editor.interface';
import { OcConnection } from '../../organizationalcharts.interface';
import { StatuscountResponse } from '../../../browsers/browsers.interface';
import { Subscription } from 'rxjs';
import { ContainerTypesEnum } from '../../../changelogs/object-types.enum';
import { BrowsersService } from '../../../browsers/browsers.service';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-oc-node-viewer',
    imports: [
        FFlowModule,
        FaIconComponent,
        TranslocoDirective,
        NgClass,
        TooltipDirective,
        RowComponent,
        ColComponent,
        BlockLoaderComponent,
        BadgeOutlineComponent,
        TranslocoPipe,
        XsButtonDirective
    ],
    templateUrl: './oc-node-viewer.component.html',
    styleUrl: './oc-node-viewer.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OcNodeViewerComponent implements OnDestroy {


    public node = model<OcTreeNode | undefined>(undefined);

    public containerType = input<ContainerTypesEnum>();

    public nodeObj: OcTreeNode | undefined = this.node();

    public connectionsInput = input<OcConnection[]>([]);

    public onViewNodeDetails = output<OcTreeNode>();

    public connections: OcConnection[] = [];
    public hasConnection: boolean = false;

    public isLoading: boolean = false;
    public statusCounts?: StatuscountResponse;


    private readonly subscriptions: Subscription = new Subscription();

    private readonly TranslocoService = inject(TranslocoService);
    private readonly BrowsersService = inject(BrowsersService);
    private cdr = inject(ChangeDetectorRef);

    public constructor() {

        effect(() => {
            this.connections = this.connectionsInput();

            this.nodeObj = this.node();

            if (this.nodeObj && this.nodeObj.node.container_id > 0) {
                this.loadHostAndServiceStatus();
            }

            // Check if the node has a connection
            this.hasConnection = false;
            const connection = this.connections.find((c) => c.organizational_chart_output_node_id === this.node()?.node.id);
            if (connection) {
                this.hasConnection = true;
            }
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private loadHostAndServiceStatus() {
        if (!this.nodeObj || !this.nodeObj.node || !this.nodeObj.node.container_id) {
            return;
        }

        this.isLoading = true;
        this.cdr.markForCheck();

        const containerId = this.nodeObj.node.container_id;
        const recursive = this.nodeObj.node.recursive;
        this.subscriptions.add(this.BrowsersService.getStatusCountsByContainer([containerId], recursive).subscribe(response => {
            this.statusCounts = response;
            this.isLoading = false;
            this.cdr.markForCheck();
        }));
    }

    protected readonly ContainerTypesEnum = ContainerTypesEnum;
    protected readonly String = String;
}
