import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';

@Component({
    selector: 'oitc-ng-select-option-checkbox',
    standalone: true,
    imports: [
        FormsModule,
        NgOptionHighlightModule
    ],
    templateUrl: './ng-select-option-checkbox.component.html',
    styleUrl: './ng-select-option-checkbox.component.css'
})
export class NgSelectOptionCheckboxComponent {
    @Input() item: any;
    @Input() item$: any;
    @Input() index!: number;
    @Input() search!: string;
}
