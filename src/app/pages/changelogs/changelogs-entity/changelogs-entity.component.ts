import { Component } from '@angular/core';
import {CoreuiComponent} from '../../../layouts/coreui/coreui.component';
import {TranslocoDirective} from '@jsverse/transloco';
import {RouterLink} from '@angular/router';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {PermissionDirective} from '../../../permissions/permission.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import {XsButtonDirective} from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
  selector: 'oitc-changelogs-entity',
  standalone: true,
    imports: [
        CoreuiComponent,
        TranslocoDirective,
        RouterLink,
        FaIconComponent,
        PermissionDirective,
        CardComponent,
        CardHeaderComponent,
        NavComponent,
        NavItemComponent,
        CardTitleDirective,
        XsButtonDirective,
        CardBodyComponent
    ],
  templateUrl: './changelogs-entity.component.html',
  styleUrl: './changelogs-entity.component.css'
})
export class ChangelogsEntityComponent {

    loadChanges() {

    }

    toggleFilter() {

    }
}
