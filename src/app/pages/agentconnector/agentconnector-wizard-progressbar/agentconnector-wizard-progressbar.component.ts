import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { AgentconnectorWizardStepsEnum } from '../agentconnector.enums';
import { NgClass, NgIf } from '@angular/common';
import { AgentModes } from '../agentconnector.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-agentconnector-wizard-progressbar',
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
    public isLastStep = input<boolean>(false);

    public goBackEvent = output<void>();
    public goNextEvent = output<void>();

    public nextButtonText: string = '';

    protected readonly AgentconnectorWizardStepsEnum = AgentconnectorWizardStepsEnum;
    protected readonly AgentModes = AgentModes;
    private readonly TranslocoService = inject(TranslocoService);

    constructor() {
        this.nextButtonText = this.TranslocoService.translate('Next');
        effect(() => {
            this.nextButtonText = this.TranslocoService.translate('Next');
            if (this.isLastStep()) {
                this.nextButtonText = this.TranslocoService.translate('Finish');
            }
        });
    }
}
