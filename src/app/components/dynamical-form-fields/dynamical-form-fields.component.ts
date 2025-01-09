import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    forwardRef,
    inject,
    Input,
    Output
} from '@angular/core';
import { DynamicalFormField } from './dynamical-form-fields.interface';

import {
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormLabelDirective
} from '@coreui/angular';
import { FormErrorDirective } from '../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../layouts/coreui/form-feedback/form-feedback.component';
import { NgForOf, NgIf } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { RequiredIconComponent } from '../required-icon/required-icon.component';
import { TrueFalseDirective } from '../../directives/true-false.directive';
import { GenericValidationError } from '../../generic-responses';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectComponent } from '../../layouts/primeng/select/select/select.component';

@Component({
    selector: 'oitc-dynamical-form-fields',
    imports: [
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    NgForOf,
    NgIf,
    PaginatorModule,
    RequiredIconComponent,
    TrueFalseDirective,
    TranslocoDirective,
    NgSelectComponent,
    SelectComponent,
    FormsModule
],
    templateUrl: './dynamical-form-fields.component.html',
    styleUrl: './dynamical-form-fields.component.css',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DynamicalFormFieldsComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicalFormFieldsComponent implements ControlValueAccessor {
    @Input() public errors: GenericValidationError | null = null;
    @Input() public formField!: DynamicalFormField;
    @Input() public name: string = '';

    @Input() disabled: boolean = false;

    /**
     * ngModel for the form
     * @group Props
     */
    @Input() ngModel: any | undefined;
    @Output() ngModelChange = new EventEmitter();


    protected readonly Object = Object;
    private cdr = inject(ChangeDetectorRef);


    //  Updates the component's value.
    writeValue(value: any): void {
        this.ngModel = value;
    }

    // Registers a callback function to be called when the value changes.
    public registerOnChange(fn: Function): void {
        this.ngModelChange.subscribe(fn);
    }

    // Registers a callback function to be called when the component is touched.
    public registerOnTouched(fn: Function): void {
        this.ngModelChange.subscribe(fn);
    }

    // Handles the disabled state of the component (optional)
    public setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    updateNgModel(value: any) {
        this.ngModel = value;
        this.ngModelChange.emit(this.ngModel);
    }

    protected readonly String = String;
}
