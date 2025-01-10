import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { TooltipDirective } from '@coreui/angular';

@Component({
    selector: 'oitc-copy-to-clipboard',
    imports: [
        TranslocoDirective,
        TooltipDirective
    ],
    templateUrl: './copy-to-clipboard.component.html',
    styleUrl: './copy-to-clipboard.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyToClipboardComponent implements OnInit {

    @Input() data?: string = '';
    private readonly TranslocoService = inject(TranslocoService);

    public tooltipText: string = '';
    private cdr = inject(ChangeDetectorRef);


    public ngOnInit(): void {
        this.tooltipText = this.TranslocoService.translate('Copy');
    }

    // Called by (click) - no manual change detection required
    public async copyToClipboard(): Promise<void> {
        if (this.data) {
            await navigator.clipboard.writeText(this.data);
            this.tooltipText = this.TranslocoService.translate('Copied');
            this.cdr.markForCheck();

            setTimeout(() => {
                // Switch tooltip text back to copy
                this.tooltipText = this.TranslocoService.translate('Copy');
                this.cdr.markForCheck();
            }, 1000);
        }
    }
}
