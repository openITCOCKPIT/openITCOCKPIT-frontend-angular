import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'oitc-fake-select',
    standalone: true,
    imports: [],
    templateUrl: './fake-select.component.html',
    styleUrl: './fake-select.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FakeSelectComponent {

}
