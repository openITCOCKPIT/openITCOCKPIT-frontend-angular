import { Component, inject, OnDestroy } from '@angular/core';
import { BlankComponent } from "../../layouts/blank/blank.component";
import { AuthService } from "../../auth/auth.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: 'oitc-login-page',
  standalone: true,
  imports: [BlankComponent, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private subscription: Subscription = new Subscription();

  private readonly formBuilder = inject(FormBuilder);
  public readonly form: FormGroup = this.formBuilder.group({
    email: ['', Validators.compose([Validators.email, Validators.required])],
    password: ['', Validators.compose([Validators.required])],
    remember_me: [true]
  });

  public constructor() {
    // this.form.get('email')?.setValue('fusselkopf@bla.com')

    /*
    this.form.patchValue({
      email: 'fusse@sadf',
      password: 'sadfdsf',

    })
    */
  }

  public login(): void {
    const {
      email,
      password,
      remember_me,
    } = this.form.value;

    this.subscription.add(this.authService.login(
      email, password, remember_me
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
