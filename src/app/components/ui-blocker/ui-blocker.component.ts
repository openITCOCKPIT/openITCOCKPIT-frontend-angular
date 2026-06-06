import { ChangeDetectionStrategy, Component, input } from '@angular/core';


@Component({
    selector: 'oitc-ui-blocker',
    imports: [],
    templateUrl: './ui-blocker.component.html',
    styleUrl: './ui-blocker.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiBlockerComponent {

    public blocked = input<boolean>(false);

}
