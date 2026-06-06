import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    ButtonGroupComponent,
    ColComponent,
    FormControlDirective,
    InputGroupComponent,
    RowComponent
} from '@coreui/angular';
import { NgClass } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-check-attempts-input',
    imports: [
        FormsModule,
        RowComponent,
        ColComponent,
        ButtonGroupComponent,
        NgClass,
        FormControlDirective,
        TranslocoPipe,
        XsButtonDirective,
        InputGroupComponent
    ],
    templateUrl: './check-attempts-input.component.html',
    styleUrl: './check-attempts-input.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckAttemptsInputComponent {

    public attempts: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    @Input() id: string | undefined;
    @Input() name: string = '';

    @Input() selectedAttempts: number = 3;
    @Output() selectedAttemptsChange = new EventEmitter<number>();

    private cdr = inject(ChangeDetectorRef);

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
