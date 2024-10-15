import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CurrentStateReportPerfdataArrayValue } from '../../currentstatereports.interface';
import {
    CurrentstatereportPerfdataGaugeComponent
} from '../currentstatereport-perfdata-gauge/currentstatereport-perfdata-gauge.component';
import { NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-currentstatereport-perfdata-gauges',
    standalone: true,
    imports: [
        CurrentstatereportPerfdataGaugeComponent,
        NgIf,
        FaIconComponent
    ],
    templateUrl: './currentstatereport-perfdata-gauges.component.html',
    styleUrl: './currentstatereport-perfdata-gauges.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentstatereportPerfdataGaugesComponent {

    @Input() public perfdata: CurrentStateReportPerfdataArrayValue[] = [];
    public colapsed: boolean = true;

}
