import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ColComponent, RowComponent } from '@coreui/angular';
import { Skeleton } from 'primeng/skeleton';

@Component({
    selector: 'oitc-proxmox-browser-loader',
    imports: [
        ColComponent,
        RowComponent,
        Skeleton
    ],
    templateUrl: './proxmox-browser-loader.component.html',
    styleUrl: './proxmox-browser-loader.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProxmoxBrowserLoaderComponent {
}
