import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'highlightSearch',
    standalone: true
})
export class HighlightSearchPipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) {
    }

    transform(value: any, args: any): any {
        if (!args) {
            return value;
        }
        // Match in a case-insensitive manner
        let re = new RegExp(args, 'gi');
        let match = value.match(re);

        // If there's no match, just return the original value.
        if (!match) {
            return value;
        }

        let replacedValue = value.replace(re, '<span class="mark-highlight">' + match[0] + '</span>')
        return this.sanitizer.bypassSecurityTrustHtml(replacedValue)
    }

}
