import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'oitc-service-timeline-legend',
    standalone: true,
    imports: [
        FaIconComponent,
        TranslocoDirective
    ],
    templateUrl: './service-timeline-legend.component.html',
    styleUrl: './service-timeline-legend.component.css'
})
export class ServiceTimelineLegendComponent {

}
