import { Component, inject, OnDestroy } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { NavigationComponent } from "../../components/navigation/navigation.component";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { AsyncPipe, DOCUMENT, JsonPipe, NgIf } from "@angular/common";
import { Subscription } from "rxjs";
import { PermissionDirective } from "../../permissions/permission.directive";
import { CoreuiComponent } from '../../layouts/coreui/coreui.component';
import {
  ButtonToolbarComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardSubtitleDirective,
  CardTitleDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective, FormSelectDirective, FormTextDirective, InputGroupTextDirective,
  ListGroupDirective,
  ListGroupItemDirective,
  NavComponent,
  NavItemComponent,
  NavLinkDirective
} from '@coreui/angular';
import { XsButtonDirective } from '../../layouts/coreui/xsbutton-directive/xsbutton.directive';

import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faAsterisk, faCircleInfo, faCoffee} from "@fortawesome/free-solid-svg-icons";
import {RequiredIconComponent} from "../../components/required-icon/required-icon.component";
import { TranslocoDirective } from "@jsverse/transloco";


@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [
    CoreuiComponent,
    HeaderComponent,
    NavigationComponent,
    RouterModule,
    AsyncPipe,
    JsonPipe,
    NgIf,
    PermissionDirective,
    CardComponent,
    CardHeaderComponent,
    ListGroupDirective,
    ListGroupItemDirective,
    CardBodyComponent,
    CardTitleDirective,
    CardSubtitleDirective,
    CardFooterComponent,
    NavComponent,
    NavItemComponent,
    NavLinkDirective,
    ButtonToolbarComponent,
    XsButtonDirective,
    FormDirective,
    FormLabelDirective,
    FormControlDirective,
    FormTextDirective,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormCheckComponent,
    InputGroupTextDirective,
    FormSelectDirective,
    FaIconComponent,
    RequiredIconComponent,
    TranslocoDirective
  ],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.css'
})
export class StartPageComponent implements OnDestroy {
  public readonly route = inject(ActivatedRoute);
  public readonly router = inject(Router);
  public readonly routeParams$ = this.route.params;
  public readonly queryParams$ = this.route.queryParams;
  private readonly subscription = new Subscription();
  private readonly document = inject(DOCUMENT);

  public constructor() {
    this.route.queryParams.subscribe({
      next: console.info,
    });
  }

  public addRandomQueryParam() {
    const key = Math.random();
    const value = Math.random();
    this.router.navigate([], {
      queryParams: {[key]: value},
      queryParamsHandling: "merge",
    })
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public callPeter() {
    type WindowWithPeter = {
      callPeter: () => void
    } & Window;

    (this.document.defaultView as unknown as WindowWithPeter).callPeter();
  }

  protected readonly faCoffee = faCoffee;
  protected readonly faCircleInfo = faCircleInfo;
  protected readonly faAsterisk = faAsterisk;
}
