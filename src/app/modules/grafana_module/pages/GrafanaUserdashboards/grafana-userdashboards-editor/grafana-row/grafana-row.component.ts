import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import {
    BorderDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { GrafanaEditorDashboardRow } from '../grafana-editor.interface';

@Component({
    selector: 'oitc-grafana-row',
    imports: [
        CardComponent,
        BorderDirective,
        CardHeaderComponent,
        CardBodyComponent,
        CardTitleDirective,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        TranslocoDirective,
        ColComponent,
        RowComponent
    ],
    templateUrl: './grafana-row.component.html',
    styleUrl: './grafana-row.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrafanaRowComponent {

    public rowIndex = input<number>(0);
    public panels = input<GrafanaEditorDashboardRow[]>([]);

    constructor() {
        effect(() => {
            console.log(this.panels());
        });
    }

}
