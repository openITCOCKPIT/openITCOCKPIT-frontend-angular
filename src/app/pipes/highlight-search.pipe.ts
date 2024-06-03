import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'highlightSearch',
    standalone: true
})
export class HighlightSearchPipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) {
    }

    transform(value: any, searchText: string | null, optionLabel: string): any {
        // Add support for path such as "value.title"
        let optionLabels = optionLabel.split('.');
        let selectboxValue: string = "";

        // Refactor this some day?
        switch (optionLabels.length) {
            case 1:
                // optionLabels = "key"
                selectboxValue = value[optionLabels[0]];
                break;
            case 2:
                // optionLabels = "key.title"
                selectboxValue = value[optionLabels[0]][optionLabels[1]];
                break;
            case 3:
                // optionLabels = "key.Hosttemplate.name"
                selectboxValue = value[optionLabels[0]][optionLabels[1]][optionLabels[2]];
                break;
            case 4:
                // optionLabels = "key.Hosttemplate.foobar.name"
                selectboxValue = value[optionLabels[0]][optionLabels[1]][optionLabels[2]][optionLabels[3]];
                break;

            default:
                console.log("WARNING: Path deep of", optionLabels.length, "is not supported");
        }

        if (!searchText) {
            // empty search term, just return the value to display it in the dropdown of the select
            return selectboxValue;
        }


        // Match in a case-insensitive manner
        let re = new RegExp(searchText, 'gi');
        let match = selectboxValue.match(re);

        // If there's no match, just return the original value.
        if (!match) {
            return selectboxValue;
        }

        let replacedValue = selectboxValue.replace(re, '<span class="mark-highlight">' + match[0] + '</span>')
        return this.sanitizer.bypassSecurityTrustHtml(replacedValue)
    }

}
