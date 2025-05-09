import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
    selector: 'oitc-word-loader',
    imports: [
        Skeleton
    ],
    templateUrl: './word-loader.component.html',
    styleUrl: './word-loader.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordLoaderComponent {

    @Input() public height: string = '0.7rem';
    @Input() public width: string = '2rem';
    @Input() public styleClass: string = 'p-0 m-0 d-inline-block';

}
