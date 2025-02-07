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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass, NgForOf } from '@angular/common';

@Component({
    selector: 'oitc-dashboard-colorpicker',
    imports: [
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        FaIconComponent,
        NgForOf,
        NgClass
    ],
    templateUrl: './dashboard-colorpicker.component.html',
    styleUrl: './dashboard-colorpicker.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardColorpickerComponent {

    @Input() colorsClasses: string[] = [
        'widget-statusRed',
        'widget-statusGreen',
        'widget-statusYellow',
        'widget-statusGrey',
        'widget-default',
        'widget-white',
        'widget-black',
        'widget-anthracite',
        'widget-colorbomb',
        'widget-colorbomb2',
        'widget-aqua',
        'widget-ocean',
        'widget-purple',
        'widget-hacktober',
        'widget-orange',
        'widget-blue'

    ];
    @Output() selectedColor = new EventEmitter<string>();

    private cdr = inject(ChangeDetectorRef);

    selectColor(color: string) {
        this.selectedColor.emit(color);
    }
}
