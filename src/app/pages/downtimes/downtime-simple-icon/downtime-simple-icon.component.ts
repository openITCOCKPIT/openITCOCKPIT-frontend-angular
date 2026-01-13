import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { Downtime } from '../downtimes.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';



@Component({
    selector: 'oitc-downtime-simple-icon',
    imports: [
    FaIconComponent,
    TranslocoDirective
],
    templateUrl: './downtime-simple-icon.component.html',
    styleUrl: './downtime-simple-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DowntimeSimpleIconComponent {
    @Input() downtime!: Downtime;
}
