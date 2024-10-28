import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
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
    styleUrl: './form-feedback.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFeedbackComponent {

    public errors = input<GenericValidationError | null | undefined>(null);
    public errorField = input.required<string>();

    public hasError: boolean = false;
    public errorMessages: string[] = [];

    private cdr = inject(ChangeDetectorRef);

    constructor() {
        effect(() => {
            this.cdr.markForCheck();

            const errors = this.errors();
            const errorField = this.errorField();

            if (this.hasError && !errors) {
                // Probably create another was clicked
                // We had errors in the bast, but now thare a no errors anymore.
                this.hasError = false;
                this.errorMessages = [];
            }

            if (errors && errorField) {
                const fieldErrorMessages = _.result(errors, errorField);

                this.hasError = false;
                this.errorMessages = [];
                if (fieldErrorMessages) {
                    this.hasError = true;
                    this.errorMessages = Object.values(fieldErrorMessages);
                }
            }

        });
    }

}
