import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { AgentconnectorWizardStepsEnum } from '../agentconnector.enums';
import { NgClass, NgIf } from '@angular/common';
import { AgentModes } from '../agentconnector.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-agentconnector-wizard-progressbar',
    standalone: true,
    imports: [
        TranslocoDirective,
        NgClass,
        FaIconComponent,
        NgIf,
        TranslocoPipe
    ],
    templateUrl: './agentconnector-wizard-progressbar.component.html',
    styleUrl: './agentconnector-wizard-progressbar.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentconnectorWizardProgressbarComponent {

    // Current step that should be highlighted
    public step = input.required<AgentconnectorWizardStepsEnum>();

    // Determins how many steps are displayed as successful
    public stepCount = input<number>(0);

    // Determine if "Exchange TLS Certificate" or "Select agent" step is displayed
    public mode = input<AgentModes>(AgentModes.Pull);
    public disableBack = input<boolean>(false);
    public disableNext = input<boolean>(false);

    protected readonly AgentconnectorWizardStepsEnum = AgentconnectorWizardStepsEnum;
}
