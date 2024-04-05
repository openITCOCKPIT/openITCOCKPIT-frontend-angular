import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import {
    SidebarBrandComponent,
    SidebarComponent,
    SidebarFooterComponent,
    SidebarHeaderComponent, SidebarToggleDirective, SidebarTogglerDirective
} from '@coreui/angular';

@Component({
  selector: 'oitc-coreui-menu',
  standalone: true,
    imports: [
        IconDirective,
        SidebarBrandComponent,
        SidebarComponent,
        SidebarFooterComponent,
        SidebarHeaderComponent,
        SidebarToggleDirective,
        SidebarTogglerDirective
    ],
  templateUrl: './coreui-menu.component.html',
  styleUrl: './coreui-menu.component.css'
})
export class CoreuiMenuComponent {

}
