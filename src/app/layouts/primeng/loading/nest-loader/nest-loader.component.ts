import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'oitc-nest-loader',
    imports: [
        SkeletonModule
    ],
    templateUrl: './nest-loader.component.html',
    styleUrl: './nest-loader.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NestLoaderComponent {

}
