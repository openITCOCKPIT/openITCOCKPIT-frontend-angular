import { ChangeDetectionStrategy, Component, effect, input, InputSignal } from '@angular/core';
import { EvcScoringInformationForRendering } from '../evc-tree.interface';
import { NgClass } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ColComponent, RowComponent, TextColorDirective } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { EventcorrelationOperators } from '../../../eventcorrelations.enum';
import { ScoreThresholdsComponent } from '../../../../../components/score-thresholds/score-thresholds.component';


@Component({
    selector: 'oitc-operator-score-tooltip',
    imports: [
        FaIconComponent,
        NgClass,
        TextColorDirective,
        TranslocoDirective,
        RowComponent,
        ColComponent,
        ScoreThresholdsComponent
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

    protected readonly EventcorrelationOperators = EventcorrelationOperators;
}
