import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { TableDirective } from '@coreui/angular';

@Component({
    selector: 'oitc-toaster-loader',
    imports: [
        SkeletonModule,
        TableDirective
    ],
    templateUrl: './toaster-loader.component.html',
    styleUrl: './toaster-loader.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToasterLoaderComponent {

}
