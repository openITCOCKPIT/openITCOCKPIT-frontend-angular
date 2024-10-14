import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ColComponent, ContainerComponent, RowComponent } from '@coreui/angular';
import { CoreuiComponent } from '../../coreui.component';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'oitc-error403',
    standalone: true,
    imports: [
        ColComponent,
        ContainerComponent,
        CoreuiComponent,
        RowComponent,
        TranslocoDirective
    ],
    templateUrl: './error403.component.html',
    styleUrl: './error403.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Error403Component {

}
