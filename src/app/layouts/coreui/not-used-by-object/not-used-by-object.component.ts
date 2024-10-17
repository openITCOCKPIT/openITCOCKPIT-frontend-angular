import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ColComponent, ContainerComponent, RowComponent } from '@coreui/angular';

@Component({
    selector: 'oitc-not-used-by-object',
    standalone: true,
    imports: [
        ColComponent,
        RowComponent,
        ContainerComponent
    ],
    templateUrl: './not-used-by-object.component.html',
    styleUrl: './not-used-by-object.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotUsedByObjectComponent {

}
