import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
    providedIn: 'root'
})
export class WeekdaysService {

    private readonly TranslocoService = inject(TranslocoService);

    private readonly weekdays = {
        1: this.TranslocoService.translate('Monday'),
        2: this.TranslocoService.translate('Tuesday'),
        3: this.TranslocoService.translate('Wednesday'),
        4: this.TranslocoService.translate('Thursday'),
        5: this.TranslocoService.translate('Friday'),
        6: this.TranslocoService.translate('Saturday'),
        7: this.TranslocoService.translate('Sunday')
    }

    constructor() {
    }

    public getWeekdays(): { [key: number]: string } {
        return this.weekdays;
    }

}
