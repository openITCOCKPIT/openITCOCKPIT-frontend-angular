import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
    OrganizationalChartsEditorComponent
} from '../organizational-charts-editor/organizational-charts-editor.component';
import { CardBodyComponent, CardComponent, CardHeaderComponent, CardTitleDirective } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'oitc-organizational-charts-index',
    imports: [
        OrganizationalChartsEditorComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        TranslocoDirective
    ],
    templateUrl: './organizational-charts-index.component.html',
    styleUrl: './organizational-charts-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationalChartsIndexComponent {

}
