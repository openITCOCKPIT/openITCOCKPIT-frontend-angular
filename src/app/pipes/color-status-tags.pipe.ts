import { Pipe, PipeTransform } from '@angular/core';

/**
 * Colors the status headlines of a long output, like "<br>WARNING:<br>", with the classes of _status-colors.scss.
 * Only a status which is alone on its line is a headline, so "OUTPUT:WARNING: ..." stays untouched.
 */
@Pipe({
    name: 'colorStatusTags',
    standalone: true,
    pure: true
})
export class ColorStatusTagsPipe implements PipeTransform {

    private readonly statusHeadline: RegExp = /(^|<br\s*\/?>)(\s*)(OK|WARNING|CRITICAL|UNKNOWN|UP|DOWN|UNREACHABLE):(?=\s*(?:<br\s*\/?>|$))/g;

    transform(value: string): string {
        return value.replace(this.statusHeadline, (match: string, lineStart: string, whitespace: string, status: string) => {
            return `${lineStart}${whitespace}<span class="fw-bold ${status.toLowerCase()}">${status}:</span>`;
        });
    }
}
