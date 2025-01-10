import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { MkagentsDownloadFileTypes } from '../../mkagents.interface';
import { ColComponent, RowComponent } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'oitc-mkagents-list-downloads',
    imports: [
        RowComponent,
        ColComponent,
        TranslocoDirective
    ],
    templateUrl: './mkagents-list-downloads.component.html',
    styleUrl: './mkagents-list-downloads.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MkagentsListDownloadsComponent {


    public filetypeWithFiles = input.required<MkagentsDownloadFileTypes>();

    public filetypeWithFilesVar?: MkagentsDownloadFileTypes;

    private cdr = inject(ChangeDetectorRef);

    constructor() {
        effect(() => {
            // Rewrite into a var for easier access in the template

            this.filetypeWithFilesVar = this.filetypeWithFiles();
            this.cdr.markForCheck();
        });
    }

}
