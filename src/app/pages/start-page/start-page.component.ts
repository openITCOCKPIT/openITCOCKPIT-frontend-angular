import {Component, inject, OnDestroy} from '@angular/core';
import {SatelliteComponent} from "../../layouts/satellite/satellite.component";
import {HeaderComponent} from "../../components/header/header.component";
import {NavigationComponent} from "../../components/navigation/navigation.component";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {AsyncPipe, JsonPipe, NgIf} from "@angular/common";
import {interval, Subscription} from "rxjs";
import {PermissionDirective} from "../../permissions/permission.directive";

@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [
    SatelliteComponent,
    HeaderComponent,
    NavigationComponent,
    RouterModule,
    AsyncPipe,
    JsonPipe,
    NgIf,
    PermissionDirective
  ],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.css'
})
export class StartPageComponent implements OnDestroy{
  public readonly route = inject(ActivatedRoute);
  public readonly router = inject(Router);

  private readonly subscription = new Subscription();

  public readonly routeParams$ = this.route.params;
  public readonly queryParams$ = this.route.queryParams;

  public addRandomQueryParam() {
    const key = Math.random();
    const value = Math.random();
    this.router.navigate([], {
      queryParams: { [key]: value },
      queryParamsHandling: "merge",
    })
  }

  public constructor() {
    this.route.queryParams.subscribe({
      next: console.info,
    })
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
