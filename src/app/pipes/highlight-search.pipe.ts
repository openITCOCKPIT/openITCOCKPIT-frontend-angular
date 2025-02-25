import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'highlightSearch',
    standalone: true
})
export class HighlightSearchPipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) {
    }

    /**
     * Angular does not escape HTML in the string, so we need to do it ourselves.
     * This function is used to escape the text so that it can be safely used in the innerHTML.
     *
     * This code is highly inspired by the escapeExpression function in chosen.jquery.js
     * https://github.com/it-novum/openITCOCKPIT/blob/50c4191a973ee67b849f2e1e1e0f264ac43c0e99/webroot/js/lib/chosen.jquery.min.js#L97-L120
     *
     * @param text
     * @private
     */
    private escapeExpression(text: string): string {
        if (text === '') {
            // Empty string, nothing to escape
            return text;
        }

        if (!/[\&\<\>\"\'\`]/.test(text)) {
            // No special characters found, nothing to escape
            return text;
        }

        const map = {
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "`": "&#x60;"
        };
        const unsafe_chars = /&(?!\w+;)|[\<\>\"\'\`]/g;

        return text.replace(unsafe_chars, (chr: string): string => {
            const charKey = chr as keyof typeof map;
            return map[charKey] || "&amp;";
        });
    }

    transform(value: any, searchText: string | null, optionLabel: string): any {
        //console.log(value);
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
            return this.escapeExpression(selectboxValue);
        }


        // Escape search text to avoid any issues with the regular expression
        // This is also copied from chosen.jquery.js
        // https://github.com/it-novum/openITCOCKPIT/blob/50c4191a973ee67b849f2e1e1e0f264ac43c0e99/webroot/js/lib/chosen.jquery.min.js#L372
        const escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

        // Match in a case-insensitive manner
        let re = new RegExp(escapedSearchText, 'gi');
        let match = selectboxValue.match(re);

        selectboxValue = this.escapeExpression(selectboxValue);

        // If there's no match, just return the original value.
        if (!match) {
            return selectboxValue;
        }

        let replacedValue = selectboxValue.replace(re, '<span class="mark-highlight">' + this.escapeExpression(match[0]) + '</span>');

        return this.sanitizer.bypassSecurityTrustHtml(replacedValue);
    }

}
