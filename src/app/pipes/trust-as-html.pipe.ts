import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// https://stackoverflow.com/a/39630507
// This is required because [innerHTML] remove style= attributes

@Pipe({
    name: 'trustAsHtml',
    standalone: true,
    pure: true
})
export class TrustAsHtmlPipe implements PipeTransform {

    constructor(private sanitized: DomSanitizer) {
    }

    transform(value: string, ...args: unknown[]): unknown {
        // https://angular.io/api/platform-browser/DomSanitizer
        return this.sanitized.bypassSecurityTrustHtml(value);
    }

}
