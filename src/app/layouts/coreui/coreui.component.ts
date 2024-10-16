import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DebounceDirective } from '../../directives/debounce.directive';
import {
    ContainerComponent,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ShadowOnScrollDirective,
    SidebarBrandComponent,
    SidebarComponent,
    SidebarFooterComponent,
    SidebarHeaderComponent,
    SidebarModule,
    SidebarNavComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
} from '@coreui/angular';
import { CoreuiHeaderComponent } from './coreui-header/coreui-header.component';
import { CoreuiFooterComponent } from './coreui-footer/coreui-footer.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { GlobalLoaderComponent } from './global-loader/global-loader.component';
import { NgFor, NgIf } from '@angular/common';
import { IconComponent } from "@coreui/icons-angular";
import { FaIconComponent, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CoreuiNavbarComponent } from './coreui-navbar/coreui-navbar.component';

@Component({
    selector: 'oitc-coreui',
    standalone: true,
    imports: [
        ContainerComponent,
        IconComponent,
        InputGroupTextDirective,
        FormControlDirective,
        InputGroupComponent,
        CoreuiHeaderComponent,
        CoreuiFooterComponent,
        ShadowOnScrollDirective,
        DebounceDirective,
        FormsModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        SidebarComponent,
        SidebarHeaderComponent,
        SidebarBrandComponent,
        SidebarNavComponent,
        SidebarFooterComponent,
        SidebarToggleDirective,
        SidebarTogglerDirective,
        NgIf,
        NgFor,
        NgScrollbarModule,
        RouterLink,
        SidebarModule,
        GlobalLoaderComponent,
        FaIconComponent,
        CoreuiNavbarComponent,
        RouterOutlet,
    ],
    templateUrl: './coreui.component.html',
    styleUrl: './coreui.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreuiComponent {

}
