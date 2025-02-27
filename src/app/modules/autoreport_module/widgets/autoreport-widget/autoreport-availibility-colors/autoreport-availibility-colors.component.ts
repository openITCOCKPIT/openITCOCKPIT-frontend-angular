import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TooltipDirective } from '@coreui/angular';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
    selector: 'oitc-autoreport-availibility-colors',
    imports: [
        FaIconComponent,
        TooltipDirective,
        TranslocoPipe
    ],
    templateUrl: './autoreport-availibility-colors.component.html',
    styleUrl: './autoreport-availibility-colors.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoreportAvailibilityColorsComponent {

}
