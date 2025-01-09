import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  SidebarModule
} from '@coreui/angular';


import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgScrollbarModule } from 'ngx-scrollbar';




import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";


@Component({
    selector: 'oitc-coreui',
    imports: [
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    SidebarModule
],
    templateUrl: './coreui.component.html',
    styleUrl: './coreui.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreuiComponent {

}
