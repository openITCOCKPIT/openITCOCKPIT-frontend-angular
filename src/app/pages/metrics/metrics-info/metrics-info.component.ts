import { Component } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    AlertHeadingDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective, ColComponent, ContainerComponent, NavComponent, NavItemComponent, RowComponent, TableDirective
} from '@coreui/angular';
import { NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'oitc-metrics-info',
  standalone: true,
    imports: [
        CoreuiComponent,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        RowComponent,
        TableDirective,
        TranslocoPipe,
        XsButtonDirective,
        AlertHeadingDirective,
        RouterLink
    ],
  templateUrl: './metrics-info.component.html',
  styleUrl: './metrics-info.component.css'
})
export class MetricsInfoComponent {
    public hostname: string = 'wurstfachverkäuferin.dockland.xyz';
    public metrics: string = 'metrics';
}
