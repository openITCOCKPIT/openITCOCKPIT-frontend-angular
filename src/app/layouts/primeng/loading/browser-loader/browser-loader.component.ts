import { Component } from '@angular/core';
import { ColComponent, RowComponent } from '@coreui/angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'oitc-browser-loader',
    standalone: true,
    imports: [
        ColComponent,
        RowComponent,
        SkeletonModule
    ],
    templateUrl: './browser-loader.component.html',
    styleUrl: './browser-loader.component.css'
})
export class BrowserLoaderComponent {

}
