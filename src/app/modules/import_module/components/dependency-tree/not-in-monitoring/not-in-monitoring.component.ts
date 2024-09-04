import { Component, Input } from '@angular/core';
import { BadgeComponent, TableDirective } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { NodeExtended } from '../dependency-tree.component';

@Component({
    selector: 'oitc-not-in-monitoring',
    standalone: true,
    imports: [
        BadgeComponent,
        FaIconComponent,
        NgForOf,
        NgIf,
        PermissionDirective,
        TableDirective,
        TranslocoDirective
    ],
    templateUrl: './not-in-monitoring.component.html',
    styleUrl: './not-in-monitoring.component.css'
})
export class NotInMonitoringComponent {
    @Input() selectedNode!: NodeExtended;

}
