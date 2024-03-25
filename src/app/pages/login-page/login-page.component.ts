import {Component, inject} from '@angular/core';
import {BlankComponent} from "../../layouts/blank/blank.component";
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'oitc-login-page',
  standalone: true,
  imports: [BlankComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public login(): void {
    console.log('login');
    this.authService.login(
      'admin@it-novum.com',
      'asdf12'
    ).subscribe({
      next: (loggedIn) => {
        console.log(loggedIn);

        this.router.navigate(['/']);
    }
    });
  }
}
