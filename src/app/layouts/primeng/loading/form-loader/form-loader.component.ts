import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'oitc-form-loader',
    standalone: true,
    imports: [
        SkeletonModule
    ],
    templateUrl: './form-loader.component.html',
    styleUrl: './form-loader.component.css'
})

// This loader mimics the optic of a generic form that is loading data
export class FormLoaderComponent {

}
