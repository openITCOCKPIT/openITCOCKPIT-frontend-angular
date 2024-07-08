import { Component } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ContainerComponent,
    NavComponent,
    NavItemComponent,
    TableDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { NotUsedByObjectComponent } from '../../../layouts/coreui/not-used-by-object/not-used-by-object.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';

@Component({
    selector: 'oitc-hosts-used-by',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ContainerComponent,
        CoreuiComponent,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NotUsedByObjectComponent,
        PermissionDirective,
        TableDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        TableLoaderComponent,
        FormLoaderComponent
    ],
    templateUrl: './hosts-used-by.component.html',
    styleUrl: './hosts-used-by.component.css'
})
export class HostsUsedByComponent {

}
