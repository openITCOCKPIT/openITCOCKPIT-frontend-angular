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
import { OcTreeNode } from '../organizational-charts-editor.interface';
import { EFConnectableSide, FFlowModule } from '@foblex/flow';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { OcConnection } from '../../organizationalcharts.interface';
import { FormsModule } from '@angular/forms';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { SelectKeyValuePathWithDisabled } from '../../../../layouts/primeng/select.interface';
import { BrowsersService } from '../../../browsers/browsers.service';
import { Subscription } from 'rxjs';
import { StatuscountResponse } from '../../../browsers/browsers.interface';
import { BlockLoaderComponent } from '../../../../layouts/primeng/loading/block-loader/block-loader.component';
import { ProgressComponent, ProgressStackedComponent } from '@coreui/angular';


@Component({
    selector: 'oitc-tenant-node',
    imports: [
        FFlowModule,
        FaIconComponent,
        FormsModule,
        XsButtonDirective,
        TranslocoDirective,
        BlockLoaderComponent,
        ProgressStackedComponent,
        ProgressComponent
    ],
    templateUrl: './tenant-node.component.html',
    styleUrl: './tenant-node.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantNodeComponent implements OnDestroy {

    //@Input() public node: OcTreeNode | undefined;
    public node = model<OcTreeNode | undefined>(undefined);
    public tenants = input<SelectKeyValuePathWithDisabled[]>([]);

    public nodeObj: OcTreeNode | undefined = this.node();

    public connectionsInput = input<OcConnection[]>([]);
    public deleteConnection = output<number | string>();

    public editNode = output<number | string | undefined>();

    protected readonly EFConnectableSide = EFConnectableSide;
    protected readonly String = String;

    public containerName: string = '';

    public connections: OcConnection[] = [];
    public hasConnection: boolean = false;

    public isLoading: boolean = false;
    public statusCounts?: StatuscountResponse;

    private connectionId: number | string = '';

    private readonly subscriptions: Subscription = new Subscription();

    private readonly TranslocoService = inject(TranslocoService);
    private readonly BrowsersService = inject(BrowsersService);
    private cdr = inject(ChangeDetectorRef);

    public constructor() {
        this.containerName = this.TranslocoService.translate('Please select');

        effect(() => {
            this.connections = this.connectionsInput();

            this.nodeObj = this.node();

            if (this.nodeObj && this.nodeObj.node.container_id > 0) {
                // Find the tenant name based on the container_id
                const tenant = this.tenants().find((t) => t.key === this.nodeObj?.node.container_id);
                if (tenant) {
                    this.loadHostAndServiceStatus();
                    this.containerName = tenant.value;
                } else {
                    this.containerName = this.TranslocoService.translate('Please select');
                }
            }

            // Check if the node has a connection
            this.hasConnection = false;
            const connection = this.connections.find((c) => c.organizational_chart_output_node_id === this.node()?.node.id);
            if (connection) {
                this.hasConnection = true;
                this.connectionId = connection.id;
            }
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onDeleteConnection(): void {
        if (this.hasConnection && this.connectionId !== '') {
            this.deleteConnection.emit(this.connectionId);
        }
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

}
