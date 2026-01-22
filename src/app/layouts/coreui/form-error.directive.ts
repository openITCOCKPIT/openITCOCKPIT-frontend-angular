import { Directive, ElementRef, HostBinding, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import _ from 'lodash';


// In case that the error directive is not working as expected
// and is not adding the 'is-invalid' class to the host element,
// please (and yes this sounds stupid) make sure that the
// "FormControlDirective" is loaded before the "FormErrorDirective" directive
// in the imports[] array of your component or module.
// See: https://github.com/openITCOCKPIT/openITCOCKPIT-frontend-angular/commit/c91c1d58a1ef9ca40b8c71b8ad632ec5615d66f7
// for an example
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
