import { Component, Input } from '@angular/core';
import { GenericValidationError } from '../../../generic-responses';
import { NgForOf, NgIf } from '@angular/common';

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
    @Input({required: true}) errorField: string = '';

    public hasError(): boolean {
        if (this.errors) {
            if (this.errors[this.errorField]) {
                return true;
            }
        }

        return false;
    }

    public getErrors(): string[] {
        if (!this.errors) {
            return [];
        }

        const errors: string[] = [];
        for (let key in this.errors[this.errorField]) {
            if (typeof (this.errors[this.errorField][key]) === 'string') {
                errors.push(this.errors[this.errorField][key]);
            } else if (typeof (this.errors[this.errorField][key]) === 'object') {
                // @ts-ignore
                for (let subKey in this.errors[this.errorField][key]) {
                    errors.push(this.errors[this.errorField][key][subKey]);
                }
            }
        }

        return errors;
    }

}
