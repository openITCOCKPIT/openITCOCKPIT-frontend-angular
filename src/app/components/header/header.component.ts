import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import {Component, inject} from '@angular/core';
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'oitc-header',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  faCoffee = faCoffee;
  private readonly authService = inject(AuthService);

  public logout(): void {
    this.authService.logout();
  }
}
