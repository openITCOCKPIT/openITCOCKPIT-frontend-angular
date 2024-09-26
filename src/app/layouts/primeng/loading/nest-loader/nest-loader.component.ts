import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'oitc-nest-loader',
    standalone: true,
    imports: [
        SkeletonModule
    ],
    templateUrl: './nest-loader.component.html',
    styleUrl: './nest-loader.component.css'
})
export class NestLoaderComponent {

}
