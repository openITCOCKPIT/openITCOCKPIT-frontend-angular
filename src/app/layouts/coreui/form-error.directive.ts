import { Directive, ElementRef, HostBinding, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import _ from 'lodash';

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
