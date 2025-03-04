import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { SelectKeyValueString } from './layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class WeekdaysService {

    private readonly TranslocoService = inject(TranslocoService);

    private readonly weekdays = [
        {key: '1', value: this.TranslocoService.translate('Monday')},
        {key: '2', value: this.TranslocoService.translate('Tuesday')},
        {key: '3', value: this.TranslocoService.translate('Wednesday')},
        {key: '4', value: this.TranslocoService.translate('Thursday')},
        {key: '5', value: this.TranslocoService.translate('Friday')},
        {key: '6', value: this.TranslocoService.translate('Saturday')},
        {key: '7', value: this.TranslocoService.translate('Sunday')},]

    constructor() {
    }

    public getWeekdays(): SelectKeyValueString[] {
        return this.weekdays;
    }

}
