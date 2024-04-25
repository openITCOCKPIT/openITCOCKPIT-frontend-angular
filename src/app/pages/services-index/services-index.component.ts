import { Component } from '@angular/core';
import {CoreuiComponent} from '../../layouts/coreui/coreui.component';
import {TranslocoDirective} from '@jsverse/transloco';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {PermissionDirective} from '../../permissions/permission.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DebounceDirective } from '../../directives/debounce.directive';
import {CardBodyComponent, CardComponent, CardHeaderComponent, CardTitleDirective} from '@coreui/angular';


@Component({
  selector: 'oitc-services-index',
  standalone: true,
    imports: [
        CoreuiComponent,
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        DebounceDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        CardTitleDirective,
    ],
  templateUrl: './services-index.component.html',
  styleUrl: './services-index.component.css'
})
export class ServicesIndexComponent {

}
