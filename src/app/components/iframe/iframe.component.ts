import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgIf } from '@angular/common';

@Component({
    selector: 'oitc-iframe',
    imports: [
        NgIf
    ],
    templateUrl: './iframe.component.html',
    styleUrl: './iframe.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class IframeComponent {

    public url = input<string>('');
    public trustedUrl: SafeResourceUrl | null = null;

    private cdr = inject(ChangeDetectorRef);

    public constructor(private sanitizer: DomSanitizer) {
        effect(() => {
            this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url());
            this.cdr.markForCheck();
        });
    }
}

