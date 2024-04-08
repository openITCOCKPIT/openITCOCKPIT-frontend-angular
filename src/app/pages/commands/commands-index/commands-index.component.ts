import { Component } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective } from '@jsverse/transloco';
import {
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardSubtitleDirective, CardTitleDirective, ListGroupDirective, ListGroupItemDirective, NavComponent, NavItemComponent
} from "@coreui/angular";
import {XsButtonDirective} from "../../../layouts/coreui/xsbutton-directive/xsbutton.directive";
import {faArrowsRotate, faCircleInfo, faFilter, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'oitc-commands-index',
  standalone: true,
  imports: [
    CoreuiComponent,
    TranslocoDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardSubtitleDirective,
    CardTitleDirective,
    ListGroupDirective,
    ListGroupItemDirective,
    NavComponent,
    NavItemComponent,
    XsButtonDirective,
    FaIconComponent
  ],
  templateUrl: './commands-index.component.html',
  styleUrl: './commands-index.component.css'
})
export class CommandsIndexComponent {

  protected readonly faCircleInfo = faCircleInfo;
  protected readonly faArrowsRotate = faArrowsRotate;
  protected readonly faPlus = faPlus;
  protected readonly faFilter = faFilter;
}
