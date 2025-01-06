import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'oitc-form-loader',
    imports: [
        SkeletonModule
    ],
    templateUrl: './form-loader.component.html',
    styleUrl: './form-loader.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})

// This loader mimics the optic of a generic form that is loading data
export class FormLoaderComponent {

}
