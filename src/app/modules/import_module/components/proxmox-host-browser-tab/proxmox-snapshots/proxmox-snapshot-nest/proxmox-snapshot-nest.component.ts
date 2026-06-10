import { ChangeDetectionStrategy, Component, input, TemplateRef } from '@angular/core';
import { ProxmoxSnapshotNested } from '../../proxmox-api.interface';
import { NgTemplateOutlet } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'oitc-proxmox-snapshot-nest',
    imports: [
        NgTemplateOutlet,
        TranslocoDirective
    ],
    templateUrl: './proxmox-snapshot-nest.component.html',
    styleUrl: './proxmox-snapshot-nest.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProxmoxSnapshotNestComponent {

    public collapsed = input<boolean[]>([]);

    public nestedSnapshots = input<ProxmoxSnapshotNested[]>([]);

    public level = input(0);

    containerTemplate = input<TemplateRef<any> | null>(null);

    public toggleCollapsed(index: number): void {
        this.collapsed()[index] = !this.collapsed()[index];
    }
}
