import { Component } from '@angular/core';
import { ColComponent, RowComponent } from '@coreui/angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'oitc-browser-menu-loader',
    standalone: true,
    imports: [
        RowComponent,
        ColComponent,
        SkeletonModule
    ],
    templateUrl: './browser-menu-loader.component.html',
    styleUrl: './browser-menu-loader.component.css'
})

// This loader mimics the optic of the menu used on /hosts/browser and /services/browser pages
export class BrowserMenuLoaderComponent {

}
