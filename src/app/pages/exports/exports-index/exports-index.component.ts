import { Component } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import {
    QueryHandlerCheckerComponent
} from '../../../layouts/coreui/query-handler-checker/query-handler-checker.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-exports-index',
    standalone: true,
    imports: [
        CoreuiComponent,
        FaIconComponent,
        PermissionDirective,
        QueryHandlerCheckerComponent,
        TranslocoDirective,
        RouterLink
    ],
    templateUrl: './exports-index.component.html',
    styleUrl: './exports-index.component.css'
})
export class ExportsIndexComponent {

}
