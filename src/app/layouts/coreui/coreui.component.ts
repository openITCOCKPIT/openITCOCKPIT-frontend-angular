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
  SidebarTogglerDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
} from '@coreui/angular';
import { CoreuiHeaderComponent } from './coreui-header/coreui-header.component';
import { CoreuiFooterComponent } from './coreui-footer/coreui-footer.component';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CoreuiMenuComponent } from './coreui-menu/coreui-menu.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RouterLink } from '@angular/router';
import {NavigationService} from "../../components/navigation/navigation.service";
import {NgIf} from "@angular/common";
import {IconComponent} from "@coreui/icons-angular";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faClose, faSearch} from "@fortawesome/free-solid-svg-icons";
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
    CoreuiMenuComponent,
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
    NgScrollbarModule,
    RouterLink,
    SidebarModule,
    FaIconComponent,
  ],
  templateUrl: './coreui.component.html',
  styleUrl: './coreui.component.css'
})
export class CoreuiComponent {
  private readonly formBuilder = inject(FormBuilder);
  public readonly navSearch: FormGroup = this.formBuilder.group({
    "searchTerm": [''],
  });
  public searchTerm : string = 'A';
  public runSearch(): void
  {
    let {searchTerm} = this.navSearch.value;
    this.searchTerm = searchTerm;
    console.error(this.searchTerm);
  }

  public clearSearch(): void{
    this.searchTerm = '';
  }

  public showSearch: boolean = true;
  public navigationService: NavigationService = inject(NavigationService);

  protected readonly faSearch = faSearch;
  protected readonly faClose = faClose;
}
