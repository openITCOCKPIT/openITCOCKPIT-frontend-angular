import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OcTreeNode } from '../organizational-charts-editor.interface';
import { EFConnectableSide, FFlowModule } from '@foblex/flow';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';


@Component({
    selector: 'oitc-tenant-node',
    imports: [
        FFlowModule,
        FaIconComponent
    ],
    templateUrl: './tenant-node.component.html',
    styleUrl: './tenant-node.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantNodeComponent {

    @Input() public node: OcTreeNode | undefined;
    protected readonly EFConnectableSide = EFConnectableSide;
}
