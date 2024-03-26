import {Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from "./auth/auth.service";
import {NgFor} from "@angular/common";
import {ListComponent} from "./components/test/list/list.component";
import {ListItemComponent} from "./components/test/list-item/list-item.component";
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'oitc-root',
  standalone: true,
  imports: [
    RouterOutlet,
      FontAwesomeModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIconPacks(fas);
  }
}
