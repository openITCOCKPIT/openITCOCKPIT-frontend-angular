import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { InputGroupTextDirective, TooltipDirective } from '@coreui/angular';

@Component({
    selector: 'oitc-input-copy',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        InputGroupTextDirective,
        TooltipDirective
    ],
    templateUrl: './input-copy.component.html',
    styleUrl: './input-copy.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputCopyComponent implements OnInit {
    @Input() copyText: string | undefined; // Text that should be copyable
    private readonly TranslocoService = inject(TranslocoService);

    public tooltipText: string = '';
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.tooltipText = this.TranslocoService.translate('Copy');
    }

    public async copyToClipboard(): Promise<void> {
        if (this.copyText) {
            await navigator.clipboard.writeText(this.copyText);
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
