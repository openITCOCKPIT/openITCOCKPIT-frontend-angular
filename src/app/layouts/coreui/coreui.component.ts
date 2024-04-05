import { Component } from '@angular/core';
import {
  ContainerComponent, ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent, SidebarToggleDirective, SidebarTogglerDirective
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { NgScrollbar } from 'ngx-scrollbar';
import { CoreuiHeaderComponent } from './coreui-header/coreui-header.component';
import { CoreuiFooterComponent } from './coreui-footer/coreui-footer.component';


@Component({
  selector: 'oitc-coreui',
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    IconDirective,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    NgScrollbar,
    CoreuiHeaderComponent,
    CoreuiFooterComponent,
    ShadowOnScrollDirective
  ],
  templateUrl: './coreui.component.html',
  styleUrl: './coreui.component.css'
})
export class CoreuiComponent {

  public navItems = [
    {
      title: true,
      name: 'Theme'
    },
    {
      name: 'Colors',
      url: '/theme/colors',
      iconComponent: { name: 'cil-drop' }
    }
  ];

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }

}
