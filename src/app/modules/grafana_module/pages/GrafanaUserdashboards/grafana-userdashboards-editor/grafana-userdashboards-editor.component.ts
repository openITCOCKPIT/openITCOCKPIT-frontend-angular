import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { OitcAlertComponent } from '../../../../../components/alert/alert.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BlockLoaderComponent } from '../../../../../layouts/primeng/loading/block-loader/block-loader.component';

@Component({
    selector: 'oitc-grafana-userdashboards-editor',
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormDirective,
        FormsModule,
        NgIf,
        OitcAlertComponent,
        PermissionDirective,
        ReactiveFormsModule,
        TranslocoDirective,
        TranslocoPipe,
        RouterLink,
        BackButtonDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
        BlockLoaderComponent
    ],
    templateUrl: './grafana-userdashboards-editor.component.html',
    styleUrl: './grafana-userdashboards-editor.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrafanaUserdashboardsEditorComponent {

    public post?: any = true; // todo fix me


    public submit(): void {
    }

    public synchronizeWithGrafana() {
        console.log('Implement synchronizeWithGrafana');
    }

}
