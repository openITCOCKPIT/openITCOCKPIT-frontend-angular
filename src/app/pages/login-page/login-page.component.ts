import {Component, inject, OnDestroy} from '@angular/core';
import {BlankComponent} from "../../layouts/blank/blank.component";
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'oitc-login-page',
  standalone: true,
  imports: [BlankComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private subscription: Subscription = new Subscription();

  public login(): void {
    this.subscription.add(this.authService.login(
      'admin@it-novum.com',
      'asdf12'
    ).subscribe({
      next: (loggedIn) => {
        console.log(loggedIn);

        this.router.navigate(['/']);
    }
    }));
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
