import { Component, inject} from '@angular/core';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarModule,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';
import { CoreuiHeaderComponent } from './coreui-header/coreui-header.component';
import { CoreuiFooterComponent } from './coreui-footer/coreui-footer.component';
import { CoreuiMenuComponent } from './coreui-menu/coreui-menu.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RouterLink } from '@angular/router';
import {NavigationService} from "../../components/navigation/navigation.service";

@Component({
  selector: 'oitc-coreui',
  standalone: true,
  imports: [
    ContainerComponent,
    CoreuiHeaderComponent,
    CoreuiFooterComponent,
    ShadowOnScrollDirective,
    CoreuiMenuComponent,
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    NgScrollbarModule,
    RouterLink,
    SidebarModule,
  ],
  templateUrl: './coreui.component.html',
  styleUrl: './coreui.component.css'
})
export class CoreuiComponent {
  public navigationService: NavigationService = inject(NavigationService);

}
