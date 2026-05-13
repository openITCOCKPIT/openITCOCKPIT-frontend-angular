import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'byteToHuman',
})
export class ByteToHumanPipe implements PipeTransform {

    transform(value: unknown, ...args: unknown[]): unknown {
        if (typeof value !== 'number' || isNaN(value)) return null;

        const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let index = 0;
        let num = value;

        while (num >= 1024 && index < units.length - 1) {
            num /= 1024;
            index++;
        }

        return `${num.toFixed(2)} ${units[index]}`;
    }
}
