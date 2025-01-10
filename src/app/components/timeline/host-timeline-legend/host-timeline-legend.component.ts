import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';


@Component({
    selector: 'oitc-host-timeline-legend',
    imports: [
    TranslocoDirective,
    FaIconComponent
],
    templateUrl: './host-timeline-legend.component.html',
    styleUrl: './host-timeline-legend.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostTimelineLegendComponent {

}
