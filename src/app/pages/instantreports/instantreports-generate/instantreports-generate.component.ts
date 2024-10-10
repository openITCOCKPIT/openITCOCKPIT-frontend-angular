import { Component } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { HostBrowserTabs } from '../../hosts/hosts.enum';

@Component({
    selector: 'oitc-instantreports-generate',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        FormDirective,
        FormLoaderComponent,
        FormsModule,
        NavComponent,
        NavItemComponent,
        NgIf,
        PermissionDirective,
        TranslocoDirective,
        XsButtonDirective,
        CardFooterComponent,
        RouterLink,
        NgClass
    ],
    templateUrl: './instantreports-generate.component.html',
    styleUrl: './instantreports-generate.component.css'
})
export class InstantreportsGenerateComponent {
    public isGeneratingReport: boolean = false;
    public selectedTab: 'generate' | 'report' = 'generate';

    public changeTab(tab: 'generate' | 'report') {
        this.selectedTab = tab;
    }

    public generateReport() {

    }

    protected readonly HostBrowserTabs = HostBrowserTabs;
}
