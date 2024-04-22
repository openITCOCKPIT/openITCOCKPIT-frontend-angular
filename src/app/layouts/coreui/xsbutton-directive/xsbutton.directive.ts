// Overwrite cButton and add 'xs' option

import { Directive, Input } from '@angular/core';
import { ButtonDirective } from '@coreui/angular';

@Directive({
    selector: '[cButton]',
    exportAs: 'cButton',
    standalone: true
})
export class XsButtonDirective extends ButtonDirective {

    // Override the size property defined in the original ButtonDirective
    // @ts-ignore
    @Input() override size?: 'xs' | 'sm' | 'lg' | '';

    // Add default as color option for buttions
    @Input() override color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | 'default' | 'primary-gradient' | 'secondary-gradient' | 'success-gradient' | 'danger-gradient' | 'warning-gradient' | 'info-gradient' | 'dark-gradient' | 'light-gradient' | string;

    constructor() {
        super(); // Call the constructor of the base class
    }
}
