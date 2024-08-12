import { Component } from '@angular/core';
import { CoreuiComponent } from '../../layouts/coreui/coreui.component';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'oitc-repository-checker',
  standalone: true,
    imports: [
        CoreuiComponent,
        TranslocoDirective
    ],
  templateUrl: './repository-checker.component.html',
  styleUrl: './repository-checker.component.css'
})
export class RepositoryCheckerComponent {

}
