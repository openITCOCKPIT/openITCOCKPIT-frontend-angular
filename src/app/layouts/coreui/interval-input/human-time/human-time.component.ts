import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';


@Component({
    selector: 'oitc-human-time',
    standalone: true,
    imports: [],
    templateUrl: './human-time.component.html',
    styleUrl: './human-time.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HumanTimeComponent {
    public humanTime: string = '';
    public seconds = input<number>(0);

    private readonly TranslocoService = inject(TranslocoService);
    private cdr = inject(ChangeDetectorRef);

    constructor() {
        effect(() => {
            this.onSecondsChanged();
        });
    }

    private onSecondsChanged(): void {
        const seconds = this.seconds();

        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let secondsMod = seconds % 60;

        let hText = this.TranslocoService.translate('hour');
        let mText = this.TranslocoService.translate('minute');
        let sText = this.TranslocoService.translate('second');

        if (hours > 1) {
            hText = this.TranslocoService.translate('hours');
        }

        if (minutes > 1) {
            mText = this.TranslocoService.translate('minutes');
        }

        if (secondsMod > 1) {
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

        if (secondsMod > 0) {
            if (minutes > 0 || hours > 0) {
                this.humanTime += ' ' + this.TranslocoService.translate('and') + ' ';
            }
            this.humanTime += secondsMod + ' ' + sText;
        }

        this.cdr.markForCheck();
    }
}
