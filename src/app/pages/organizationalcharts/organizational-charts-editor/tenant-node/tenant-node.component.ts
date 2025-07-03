import { ChangeDetectionStrategy, Component, effect, input, Input, output } from '@angular/core';
import { OcTreeNode } from '../organizational-charts-editor.interface';
import { EFConnectableSide, FFlowModule } from '@foblex/flow';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { JsonPipe } from '@angular/common';
import { OcConnection } from '../../organizationalcharts.interface';


@Component({
    selector: 'oitc-tenant-node',
    imports: [
        FFlowModule,
        FaIconComponent,
        JsonPipe
    ],
    templateUrl: './tenant-node.component.html',
    styleUrl: './tenant-node.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantNodeComponent {

    @Input() public node: OcTreeNode | undefined;

    public connectionsInput = input<OcConnection[]>([]);
    public deleteConnection = output<number | string>();

    protected readonly EFConnectableSide = EFConnectableSide;
    protected readonly String = String;

    public connections: OcConnection[] = [];
    public hasConnection: boolean = false;

    private connectionId: number | string = '';

    public constructor() {
        effect(() => {
            this.connections = this.connectionsInput();

            // Check if the node has a connection
            this.hasConnection = false;
            const connection = this.connections.find((c) => c.organizational_chart_output_node_id === this.node?.node.id);
            if (connection) {
                this.hasConnection = true;
                this.connectionId = connection.id;
            }
        });
    }

    public onDeleteConnection(): void {
        if (this.hasConnection && this.connectionId !== '') {
            this.deleteConnection.emit(this.connectionId);
        }
    }

}
