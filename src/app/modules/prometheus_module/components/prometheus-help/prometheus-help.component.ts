import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'oitc-prometheus-help',
    imports: [
        TranslocoDirective
    ],
    templateUrl: './prometheus-help.component.html',
    styleUrl: './prometheus-help.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrometheusHelpComponent {
    @Input({required: true}) public uuid: string = '';
}
