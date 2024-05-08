import { Component, inject, Input } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { InputGroupTextDirective, TooltipDirective } from '@coreui/angular';

@Component({
    selector: 'oitc-input-copy',
    standalone: true,
    imports: [
        TranslocoDirective,
        FaIconComponent,
        InputGroupTextDirective,
        TooltipDirective
    ],
    templateUrl: './input-copy.component.html',
    styleUrl: './input-copy.component.css'
})
export class InputCopyComponent {
    @Input() copyText: string | undefined; // Text that should be copyable
    private readonly TranslocoService = inject(TranslocoService);

    public tooltipText: string = '';

    public ngOnInit(): void {
        this.tooltipText = this.TranslocoService.translate('Copy');
    }

    public async copyToClipboard(): Promise<void> {
        if (this.copyText) {
            await navigator.clipboard.writeText(this.copyText);
            this.tooltipText = this.TranslocoService.translate('Copied');

            // Wait 1 second
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Switch tooltip text back to copy
            this.tooltipText = this.TranslocoService.translate('Copy');
        }
    }
}
