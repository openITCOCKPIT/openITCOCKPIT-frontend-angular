import { ChangeDetectionStrategy, Component, effect, input, Input, output } from '@angular/core';
import { OcTreeNode } from '../organizational-charts-editor.interface';
import { EFConnectableSide, FFlowModule } from '@foblex/flow';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { JsonPipe } from '@angular/common';
import { OrganizationalChartsTreeConnection } from '../../organizationalcharts.interface';


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

    public connectionsInput = input<OrganizationalChartsTreeConnection[]>([]);
    public deleteConnection = output<string>();

    protected readonly EFConnectableSide = EFConnectableSide;
    protected readonly String = String;

    public connections: OrganizationalChartsTreeConnection[] = [];
    public hasConnection: boolean = false;

    private connectionUuid: string = '';

    public constructor() {
        effect(() => {
            this.connections = this.connectionsInput();

            // Check if the node has a connection
            this.hasConnection = false;
            const connection = this.connections.find((c) => c.fOutputId === this.node?.node.id);
            if (connection) {
                this.hasConnection = true;
                this.connectionUuid = connection.uuid;
            }
        });
    }

    public onDeleteConnection(): void {
        if (this.hasConnection && this.connectionUuid !== '') {
            this.deleteConnection.emit(this.connectionUuid);
        }
    }

}
