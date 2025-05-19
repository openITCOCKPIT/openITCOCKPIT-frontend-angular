import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormSelectDirective } from '@coreui/angular';

@Component({
    selector: 'oitc-fake-select',
    imports: [
        FormSelectDirective
    ],
    templateUrl: './fake-select.component.html',
    styleUrl: './fake-select.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FakeSelectComponent {

}
