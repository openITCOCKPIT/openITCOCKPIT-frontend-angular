import {Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {NavigationService} from "./navigation.service";
import {combineLatestWith, filter, map, ReplaySubject, Subject, Subscription, tap} from "rxjs";
import {combineLatest} from "rxjs/internal/operators/combineLatest";

@Directive({
  selector: '[oitcNavigation]',
  standalone: true
})
export class NavigationDirective implements OnInit, OnDestroy {
  private readonly navigationService = inject(NavigationService);
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);

  private readonly subscription = new Subscription();

  @Input({ required: true })
  public set oitcNavigation(value: string | string[]) {

    this.oitcNavigation$$.next(value);
  };

  private readonly oitcNavigation$$ = new ReplaySubject<string | string[]>();

  public ngOnInit() {
    this.subscription.add(this.oitcNavigation$$.pipe(
        combineLatestWith(this.navigationService.links$),
        tap(([a, b]) => console.log('navigation directive', a, b)),
    ).subscribe({
      next: () => this.viewContainer.createEmbeddedView(this.templateRef),
    }));
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
