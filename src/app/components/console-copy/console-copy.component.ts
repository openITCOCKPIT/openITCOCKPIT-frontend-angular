import { Component, Input, OnChanges } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TrustAsHtmlPipe } from '../../pipes/trust-as-html.pipe';
import { CoreuiComponent } from '../../layouts/coreui/coreui.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { MatTooltip } from '@angular/material/tooltip';
import { ButtonDirective } from '@coreui/angular';

@Component({
    selector: 'oitc-console-copy',
    standalone: true,
    imports: [
        FaIconComponent,
        TrustAsHtmlPipe,
        CoreuiComponent,
        TranslocoDirective,
        MatTooltip,
        TranslocoPipe,
        ButtonDirective
    ],
    templateUrl: './console-copy.component.html',
    styleUrl: './console-copy.component.css'
})
export class ConsoleCopyComponent implements OnChanges {
    @Input({required: true}) public command: string = '';
    @Input() htmlCommand: string = '';
    protected _htmlCommand: string = '';

    protected copy(): void {
        navigator.clipboard.writeText(this.command);
    }

    public ngOnChanges(): void {
        if (this.htmlCommand === '') {
            this._htmlCommand = this.command.replaceAll('\n', '<br />');
            return;
        }
        this._htmlCommand = this.htmlCommand;
    }
}
