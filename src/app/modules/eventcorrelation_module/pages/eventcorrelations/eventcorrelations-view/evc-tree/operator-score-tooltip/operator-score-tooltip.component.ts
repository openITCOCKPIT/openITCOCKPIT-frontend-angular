import { ChangeDetectionStrategy, Component, effect, input, InputSignal } from '@angular/core';
import { EvcScoringInformationForRendering } from '../evc-tree.interface';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'oitc-operator-score-tooltip',
    imports: [
        JsonPipe
    ],
    templateUrl: './operator-score-tooltip.component.html',
    styleUrl: './operator-score-tooltip.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorScoreTooltipComponent {

    public scoringInformationInput: InputSignal<EvcScoringInformationForRendering | undefined> = input<EvcScoringInformationForRendering | undefined>();

    public scorignInformation: EvcScoringInformationForRendering | undefined;

    constructor() {
        effect(() => {
            if (this.scoringInformationInput()) {
                // Update the local variable with the new input value
                this.scorignInformation = this.scoringInformationInput();
            }
        });
    }

}
