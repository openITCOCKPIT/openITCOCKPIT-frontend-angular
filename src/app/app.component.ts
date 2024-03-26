import {Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from "./auth/auth.service";

@Component({
  selector: 'oitc-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend-angular';

  private readonly authService = inject(AuthService);

  public login() {
    this.authService.goToLogin();
  }

  public logout() {
    this.authService.goToLogout();
  }
}
