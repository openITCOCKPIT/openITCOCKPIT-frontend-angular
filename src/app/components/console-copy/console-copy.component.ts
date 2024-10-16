import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TrustAsHtmlPipe } from '../../pipes/trust-as-html.pipe';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { MatTooltip } from '@angular/material/tooltip';
import { ButtonDirective } from '@coreui/angular';

@Component({
    selector: 'oitc-console-copy',
    standalone: true,
    imports: [
        FaIconComponent,
        TrustAsHtmlPipe,

        TranslocoDirective,
        MatTooltip,
        TranslocoPipe,
        ButtonDirective
    ],
    templateUrl: './console-copy.component.html',
    styleUrl: './console-copy.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsoleCopyComponent {

    public command = input<string>('')

    protected _htmlCommand: string = '';

    private cdr = inject(ChangeDetectorRef);

    constructor() {
        effect(() => {
            this._htmlCommand = this.command().replaceAll('\n', '<br />');
            this.cdr.markForCheck();
        });
    }

    protected copy(): void {
        navigator.clipboard.writeText(this.command());
    }
}
