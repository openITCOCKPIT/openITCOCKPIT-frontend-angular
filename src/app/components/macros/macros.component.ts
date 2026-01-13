import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { Customvariable } from '../../pages/contacts/contacts.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';

import { NgSelectModule } from '@ng-select/ng-select';
import { GenericValidationError } from '../../generic-responses';
import { FormFeedbackComponent } from '../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../required-icon/required-icon.component';
import { ObjectTypesEnum } from '../../pages/changelogs/object-types.enum';

@Component({
    selector: 'oitc-macros',
    imports: [
    FaIconComponent,
    FormsModule,
    TranslocoDirective,
    NgSelectModule,
    FormFeedbackComponent,
    RequiredIconComponent
],
    templateUrl: './macros.component.html',
    styleUrl: './macros.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MacrosComponent implements OnInit {

    @Input() public macro!: Customvariable;

    @Input() public macroName: 'CONTACT' | 'HOST' | 'SERVICE' = 'HOST';
    @Input() public index: number = 0;
    @Input() public deleteMacroCallback: Function = () => {
    };
    @Input() public errors: GenericValidationError | null = null;

    protected textClass: string = 'text-primary';
    private cdr = inject(ChangeDetectorRef);

    protected updateName(): void {
        let name = this.macro.name.toUpperCase();
        name = name.replace(/[^\d\w\_]/g, '');
        this.macro.name = name;
        this.cdr.markForCheck();

    }

    public ngOnInit() {
        switch (this.macro.objecttype_id) {
            case ObjectTypesEnum['HOSTTEMPLATE']:
            case ObjectTypesEnum['SERVICETEMPLATE']:
                this.textClass = 'text-success';
                break;
            default:
                this.textClass = 'text-primary';
                break;
        }
    }

    public togglePassword() {
        this.macro.password = this.macro.password === 0 ? 1 : 0;
        this.cdr.markForCheck();
    }

    public deleteMacro() {
        this.deleteMacroCallback(this.index);
    }
}
