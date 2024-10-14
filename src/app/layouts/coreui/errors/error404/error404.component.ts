import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CoreuiComponent } from '../../coreui.component';
import { ColComponent, ContainerComponent, RowComponent } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'oitc-error404',
    standalone: true,
    imports: [
        CoreuiComponent,
        ContainerComponent,
        RowComponent,
        ColComponent,
        TranslocoDirective
    ],
    templateUrl: './error404.component.html',
    styleUrl: './error404.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Error404Component {

}
