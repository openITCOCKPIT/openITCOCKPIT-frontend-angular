import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OcTreeNode } from '../organizational-charts-editor.interface';


@Component({
    selector: 'oitc-tenant-node',
    imports: [],
    templateUrl: './tenant-node.component.html',
    styleUrl: './tenant-node.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantNodeComponent {

    @Input() public node: OcTreeNode | undefined;
}
