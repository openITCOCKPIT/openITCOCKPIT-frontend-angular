import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'oitc-ui-blocker',
    standalone: true,
    imports: [
        NgIf
    ],
    templateUrl: './ui-blocker.component.html',
    styleUrl: './ui-blocker.component.css'
})
export class UiBlockerComponent {

    @Input() public blocked: boolean = false;

}
