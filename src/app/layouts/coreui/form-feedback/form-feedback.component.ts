import { Component, Input } from '@angular/core';
import { GenericValidationError } from '../../../generic-responses';
import { NgForOf, NgIf } from '@angular/common';
import _ from 'lodash';

@Component({
    selector: 'oitc-form-feedback',
    standalone: true,
    imports: [
        NgIf,
        NgForOf
    ],
    templateUrl: './form-feedback.component.html',
    styleUrl: './form-feedback.component.css'
})
export class FormFeedbackComponent {

    @Input() public errors?: GenericValidationError | null = null;
    // field like "name" or path like "containers.name"
    @Input({required: true}) errorField: string = '';

    public hasError(): boolean {
        const errors = _.result(this.errors, this.errorField);
        if (errors) {
            return true;
        }

        return false;
    }

    public getErrors(): string[] {
        if (!this.errors) {
            return [];
        }

        const errors = _.result(this.errors, this.errorField);
        if (!errors) {
            return [];
        }

        return Object.values(errors);
    }

}
