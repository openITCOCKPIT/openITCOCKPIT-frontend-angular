import {Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from "./auth/auth.service";
import {NgFor} from "@angular/common";
import {ListComponent} from "./components/test/list/list.component";
import {ListItemComponent} from "./components/test/list-item/list-item.component";

@Component({
  selector: 'oitc-root',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
