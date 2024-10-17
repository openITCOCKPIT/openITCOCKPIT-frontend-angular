import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    Output
} from '@angular/core';
import {
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective
} from '@coreui/angular';
import { NgForOf, NgStyle } from '@angular/common';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-dropdown-colorpicker',
    standalone: true,
    imports: [
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        NgForOf,
        XsButtonDirective,
        NgStyle,
        FaIconComponent
    ],
    templateUrl: './dropdown-colorpicker.component.html',
    styleUrl: './dropdown-colorpicker.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownColorpickerComponent {

    @Input() colors: string[] = [];
    @Output() selectedColor = new EventEmitter<string>();

    private cdr = inject(ChangeDetectorRef);

    selectColor(color: string) {
        this.selectedColor.emit(color);
    }

}
