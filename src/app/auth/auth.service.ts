import {computed, Injectable, Signal, signal, WritableSignal} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly jwt: WritableSignal<string|null> = signal(null);

  public readonly authenticated: Signal<boolean> = computed(() => {
    return !!this.jwt();
  });

  public login() {
    // fake login
    this.jwt.set('fake_token')
  }

  public logout() {
    this.jwt.set(null);
  }
}
