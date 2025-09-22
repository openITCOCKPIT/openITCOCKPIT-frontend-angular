import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ColDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective,
    TextColorDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';
import { DebounceDirective } from '../../../directives/debounce.directive';
import {
    RegexHelperTooltipComponent
} from '../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'oitc-statuspagegroups-viewer',
    imports: [
        RowComponent,
        ColComponent,
        CardComponent,
        FaIconComponent,
        CardBodyComponent,
        ColDirective,
        CardTitleDirective,
        TextColorDirective,
        CardHeaderComponent,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        TableDirective,
        TableDirective,
        BadgeOutlineComponent,
        FormCheckInputDirective,
        DebounceDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        FormControlDirective,
        FormCheckComponent,
        RegexHelperTooltipComponent,
        TranslocoDirective
    ],
    templateUrl: './statuspagegroups-viewer.component.html',
    styleUrl: './statuspagegroups-viewer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagegroupsViewerComponent {

}
