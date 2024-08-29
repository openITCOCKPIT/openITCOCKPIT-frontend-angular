import { Component, Input } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'oitc-block-loader',
    standalone: true,
    imports: [
        SkeletonModule
    ],
    templateUrl: './block-loader.component.html',
    styleUrl: './block-loader.component.css'
})

// This loader can be used to show a block of data that is being loaded.
// Such as a tab or an iframe.
export class BlockLoaderComponent {

    @Input() public height: string = '8rem';

}
