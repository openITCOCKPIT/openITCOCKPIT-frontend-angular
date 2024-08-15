import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ColComponent, RowComponent } from '@coreui/angular';

@Component({
    selector: 'oitc-host-timeline-legend',
    standalone: true,
    imports: [
        TranslocoDirective,
        FaIconComponent,
        RowComponent,
        ColComponent
    ],
    templateUrl: './host-timeline-legend.component.html',
    styleUrl: './host-timeline-legend.component.css'
})
export class HostTimelineLegendComponent {

}
