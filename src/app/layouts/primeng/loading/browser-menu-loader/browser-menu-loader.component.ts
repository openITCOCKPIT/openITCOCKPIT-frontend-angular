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
export class BrowserMenuLoaderComponent {

}
