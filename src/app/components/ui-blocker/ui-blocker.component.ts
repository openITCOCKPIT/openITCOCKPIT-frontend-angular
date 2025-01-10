import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'oitc-ui-blocker',
    imports: [
        NgIf
    ],
    templateUrl: './ui-blocker.component.html',
    styleUrl: './ui-blocker.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiBlockerComponent {

    public blocked = input<boolean>(false);

}
