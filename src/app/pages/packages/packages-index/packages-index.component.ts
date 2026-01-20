import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    RowComponent, TabDirective, TableDirective,
    TabPanelComponent, TabsComponent, TabsContentComponent, TabsListComponent,
    TemplateIdDirective,
    TextColorDirective,
    WidgetStatFComponent
} from '@coreui/angular';

import { cil3d, cilList, cilShieldAlt } from '@coreui/icons';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';

@Component({
    selector: 'oitc-packages-index',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        RowComponent,
        TemplateIdDirective,
        WidgetStatFComponent,
        TextColorDirective,
        TranslocoPipe,
        TableDirective,
        BadgeOutlineComponent,
        TabsComponent,
        TabsListComponent,
        TabDirective,
        TabsContentComponent,
        TabPanelComponent
    ],
    templateUrl: './packages-index.component.html',
    styleUrl: './packages-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackagesIndexComponent {
    icons = {cilList, cilShieldAlt, cil3d};
}
