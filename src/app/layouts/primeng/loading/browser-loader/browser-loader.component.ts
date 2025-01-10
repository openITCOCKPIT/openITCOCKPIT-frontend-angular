import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ColComponent, RowComponent } from '@coreui/angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'oitc-browser-loader',
    imports: [
        ColComponent,
        RowComponent,
        SkeletonModule
    ],
    templateUrl: './browser-loader.component.html',
    styleUrl: './browser-loader.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})

// This loader mimics the optic of the /hosts/browser and /services/browser pages
export class BrowserLoaderComponent {

}
