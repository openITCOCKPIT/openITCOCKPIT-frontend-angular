import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { isNaN } from 'lodash';

@Component({
    selector: 'oitc-prometheus-thresholds',
    imports: [
        NgClass,
    ],
    templateUrl: './prometheus-thresholds.component.html',
    styleUrl: './prometheus-thresholds.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrometheusThresholdsComponent {
    @Input({required: true}) min: number | null = 0;
    @Input({required: true}) max: number | null = 0;
    @Input({required: true}) type: string = 'warning';
    @Input({required: true}) inclusive: boolean = false;
    protected readonly isNaN = isNaN;
    protected readonly Number = Number;
}
