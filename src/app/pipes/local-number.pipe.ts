import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'localNumber'
})
export class LocalNumberPipe implements PipeTransform {

    /**
     * Formats a number to the local number format
     * The original Angular number pipe requires to set a LOCALE_ID token in the app config
     *
     * @param value
     * @param args
     */
    transform(value: number | undefined, ...args: unknown[]): unknown {
        if (!value) {
            return value;
        }

        const options: Intl.NumberFormatOptions = {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        };
        const format = new Intl.NumberFormat(undefined, options);
        return format.format(value);
    }

}
