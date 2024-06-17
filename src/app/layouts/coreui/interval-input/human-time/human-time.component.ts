import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';


@Component({
    selector: 'oitc-human-time',
    standalone: true,
    imports: [],
    templateUrl: './human-time.component.html',
    styleUrl: './human-time.component.css'
})
export class HumanTimeComponent {
    private _seconds: number = 0;
    public humanTime: string = '';

    private readonly TranslocoService = inject(TranslocoService);

    @Input()
    set seconds(value: number) {
        this._seconds = value;
        this.onSecondsChanged();
    }

    get seconds(): number {
        return this._seconds;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['seconds']) {
            this.onSecondsChanged();
        }
    }

    private onSecondsChanged(): void {
        let hours = Math.floor(this.seconds / 3600);
        let minutes = Math.floor((this.seconds % 3600) / 60);
        let seconds = this.seconds % 60;

        let hText = this.TranslocoService.translate('hour');
        let mText = this.TranslocoService.translate('minute');
        let sText = this.TranslocoService.translate('second');

        if (hours > 1) {
            hText = this.TranslocoService.translate('hours');
        }

        if (minutes > 1) {
            mText = this.TranslocoService.translate('minutes');
        }

        if (seconds > 1) {
            sText = this.TranslocoService.translate('seconds');
        }

        this.humanTime = '';

        if (hours > 0) {
            this.humanTime = hours + ' ' + hText;
        }

        if (minutes > 0) {
            if (hours > 0) {
                this.humanTime += ' ' + this.TranslocoService.translate('and') + ' ';
            }
            this.humanTime += minutes + ' ' + mText;
        }

        if (seconds > 0) {
            if (minutes > 0 || hours > 0) {
                this.humanTime += ' ' + this.TranslocoService.translate('and') + ' ';
            }
            this.humanTime += seconds + ' ' + sText;
        }

    }
}
