import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { ColComponent, ContainerComponent, RowComponent } from '@coreui/angular';

@Component({
    selector: 'oitc-no-records',
    standalone: true,
    imports: [
        TranslocoDirective,
        ContainerComponent,
        ColComponent,
        RowComponent
    ],
    templateUrl: './no-records.component.html',
    styleUrl: './no-records.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoRecordsComponent {

}
