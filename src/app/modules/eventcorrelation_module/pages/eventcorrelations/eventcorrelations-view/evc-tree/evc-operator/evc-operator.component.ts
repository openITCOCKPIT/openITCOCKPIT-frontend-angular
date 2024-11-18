import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { ConnectionOperator } from '../evc-tree.interface'

@Component({
    selector: 'oitc-evc-operator',
    standalone: true,
    imports: [],
    templateUrl: './evc-operator.component.html',
    styleUrl: './evc-operator.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvcOperatorComponent {

    public connection = input<ConnectionOperator>();

    constructor() {
        effect(() => {
            console.log(this.connection());
        });
    }

}
