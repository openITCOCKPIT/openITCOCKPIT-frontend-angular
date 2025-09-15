import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { StatupagegroupProblem } from '../statuspagegroups.interface';
import { AsyncPipe } from '@angular/common';
import {
    StatuspageIconSimpleComponent
} from '../../statuspages/statuspage-icon-simple/statuspage-icon-simple.component';
import { RouterLink } from '@angular/router';
import { PermissionsService } from '../../../permissions/permissions.service';

@Component({
    selector: 'oitc-statuspagegroups-marquee',
    imports: [
        AsyncPipe,
        StatuspageIconSimpleComponent,
        RouterLink
    ],
    templateUrl: './statuspagegroups-marquee.component.html',
    styleUrl: './statuspagegroups-marquee.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagegroupsMarqueeComponent {

    public problems = input<StatupagegroupProblem[]>([]);
    public readonly PermissionsService = inject(PermissionsService);


    constructor() {
        effect(() => {
            this.problems();
        });
    }

}
