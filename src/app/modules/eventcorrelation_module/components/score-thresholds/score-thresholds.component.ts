import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { isNaN } from 'lodash';

@Component({
    selector: 'oitc-score-thresholds',
    imports: [
        NgClass,
    ],
    templateUrl: './score-thresholds.component.html',
    styleUrl: './score-thresholds.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreThresholdsComponent {
    @Input({required: true}) min: number | null = 0;
    @Input({required: true}) max: number | null = 0;
    @Input({required: true}) type: string = 'warning';
    @Input({required: true}) inclusive: boolean = false;
    protected readonly Number = Number;
}
