import { Directive, ElementRef, HostBinding, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import _ from 'lodash';


// In case that the error directive is not working as expected
// and is not adding the 'is-invalid' class to the host element,
// please (and yes this sounds stupid) make sure that the
// "FormControlDirective" is loaded before the "FormErrorDirective" directive
// in the imports[] array of your component or module.

@Directive({
    selector: '[oitcFormError]',
    standalone: true
})
export class FormErrorDirective {

    constructor(
        private hostElement: ElementRef
    ) {
    }

    @Input() errors?: ValidationErrors | null = null;
    @Input({required: true}) errorField: string = '';

    @HostBinding('class')
    get hostClasses(): any {
        if (!this.errors) {
            return {};
        }

        const errors = _.result(this.errors, this.errorField);
        if (errors) {
            return {
                'is-invalid': true
            }
        }
    }

}
