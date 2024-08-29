import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgIf } from '@angular/common';

@Component({
    selector: 'oitc-iframe',
    standalone: true,
    imports: [
        NgIf
    ],
    templateUrl: './iframe.component.html',
    styleUrl: './iframe.component.css'
})

export class IframeComponent implements OnChanges {
    @Input() url: string = '';
    trustedUrl: SafeResourceUrl | null = null;

    public constructor(private sanitizer: DomSanitizer) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['url']) {
            this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
        }
    }
}

