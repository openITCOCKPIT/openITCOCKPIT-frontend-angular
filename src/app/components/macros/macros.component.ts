import { Component, Input, input, OnInit } from '@angular/core';
import { Customvariable } from '../../pages/contacts/contacts.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { CoreuiComponent } from '../../layouts/coreui/coreui.component';
import { FormErrorDirective } from '../../layouts/coreui/form-error.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { GenericValidationError } from '../../generic-responses';

@Component({
    selector: 'oitc-macros',
    standalone: true,
    imports: [
        FaIconComponent,
        FormsModule,
        NgIf,
        TranslocoPipe,
        CoreuiComponent,
        TranslocoDirective,
        FormErrorDirective,
        NgSelectModule
    ],
    templateUrl: './macros.component.html',
    styleUrl: './macros.component.css'
})
export class MacrosComponent implements OnInit {

    @Input() public macro: Customvariable = {} as Customvariable;
    @Input() public macroName: string = '';
    @Input() public index: number | string = 0;
    @Input() public deleteMacroCallback: Function = () => {
    };
    @Input() public errors: Function = (): GenericValidationError[] => {
        return [] as GenericValidationError[];
    };

    protected textClass: string = 'text-primary';

    protected updateName(): void {
        let name = this.macro.name.toUpperCase();
        name = name.replace(/[^\d\w\_]/g, '');
        this.macro.name = name;
    }

    public ngOnInit() {
        switch (this.macro.objecttype_id) {
            case 512:
            case 4096:
                this.textClass = 'text-success';
                break;
            default:
                this.textClass = 'text-primary';
                break;
        }
    }

    public togglePassword() {
        this.macro.password = this.macro.password === 0 ? 1 : 0;
    }

    public deleteMacro() {
        this.deleteMacroCallback(this.index);
    }
}
