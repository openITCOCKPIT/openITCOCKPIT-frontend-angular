import { Component, inject, Input, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { TooltipDirective } from '@coreui/angular';

@Component({
    selector: 'oitc-copy-to-clipboard',
    standalone: true,
    imports: [
        TranslocoDirective,
        TooltipDirective
    ],
    templateUrl: './copy-to-clipboard.component.html',
    styleUrl: './copy-to-clipboard.component.css'
})
export class CopyToClipboardComponent implements OnInit {

    @Input() data?: string = '';
    private readonly TranslocoService = inject(TranslocoService);

    public tooltipText: string = '';

    public ngOnInit(): void {
        this.tooltipText = this.TranslocoService.translate('Copy');
    }

    public async copyToClipboard(): Promise<void> {
        if (this.data) {
            await navigator.clipboard.writeText(this.data);
            this.tooltipText = this.TranslocoService.translate('Copied');

            // Wait 1 second
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Switch tooltip text back to copy
            this.tooltipText = this.TranslocoService.translate('Copy');
        }
    }
}
