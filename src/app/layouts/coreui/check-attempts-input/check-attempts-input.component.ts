import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonGroupComponent, ColComponent, FormControlDirective, RowComponent } from '@coreui/angular';
import { NgClass, NgForOf } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-check-attempts-input',
    standalone: true,
    imports: [
        FormsModule,
        RowComponent,
        ColComponent,
        ButtonGroupComponent,
        NgClass,
        FormControlDirective,
        TranslocoPipe,
        XsButtonDirective,
        NgForOf
    ],
    templateUrl: './check-attempts-input.component.html',
    styleUrl: './check-attempts-input.component.css'
})
export class CheckAttemptsInputComponent {

    public attempts: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    @Input() id: string | undefined;
    @Input() name: string = '';

    @Input() selectedAttempts: number = 3;
    @Output() selectedAttemptsChange = new EventEmitter<number>();

    public constructor() {

    }

    public updateAttempts() {
        this.selectedAttemptsChange.emit(this.selectedAttempts);
    }

    public changeAttempts(attempts: number): void {
        this.selectedAttempts = attempts;
        this.selectedAttemptsChange.emit(attempts);
    }

}
