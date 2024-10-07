import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DynamicalFormFields } from './dynamical-form-fields.interface';
import { DebounceDirective } from '../../directives/debounce.directive';
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
import { Subject } from 'rxjs';
import { MultiSelectChangeEvent, MultiSelectFilterEvent } from 'primeng/multiselect';
import { NgSelectComponent } from '@ng-select/ng-select';
import { SelectComponent } from '../../layouts/primeng/select/select/select.component';

@Component({
    selector: 'oitc-dynamical-form-fields',
    standalone: true,
    imports: [
        DebounceDirective,
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
        SelectComponent
    ],
    templateUrl: './dynamical-form-fields.component.html',
    styleUrl: './dynamical-form-fields.component.css'
})
export class DynamicalFormFieldsComponent {
    @Input() public errors: GenericValidationError | null = null;
    @Input() public formFields: DynamicalFormFields = {};
    /**
     * ngModel for the form
     * @group Props
     */
    @Input() ngModel: any | undefined;
    @Input() debounce: boolean = false;
    @Input() debounceTime: number = 500;
    private onChangeSubject = new Subject<any>();
    @Output() ngModelChange = new EventEmitter();
    @Output() onChange: EventEmitter<MultiSelectChangeEvent> = new EventEmitter<MultiSelectChangeEvent>();
    @Output() onFilter: EventEmitter<MultiSelectFilterEvent> = new EventEmitter<MultiSelectFilterEvent>();

    protected readonly Object = Object;

    updateNgModel(value: any) {
        this.ngModel = value;
        this.ngModelChange.emit(this.ngModel);
    }

    triggerOnChange(event: any) {
        if (this.debounce) {
            this.onChangeSubject.next(event);
        } else {
            this.onChange.emit(event);
        }
    }

    triggerOnFilter(event: any) {
        this.onFilter.emit(event);
    }

    protected readonly String = String;
}
