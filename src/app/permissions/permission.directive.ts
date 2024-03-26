import {Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {PermissionsService} from "./permissions.service";
import {combineLatestWith, filter, map, ReplaySubject, Subject, Subscription, tap} from "rxjs";
import {combineLatest} from "rxjs/internal/operators/combineLatest";

@Directive({
  selector: '[oitcPermission]',
  standalone: true
})
export class PermissionDirective implements OnInit, OnDestroy {
  private readonly permissionService = inject(PermissionsService);
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);

  private readonly subscription = new Subscription();

  @Input({ required: true })
  public set oitcPermission(value: string | string[]) {

    this.oitcPermission$$.next(value);
  };

  private readonly oitcPermission$$ = new ReplaySubject<string | string[]>();

  public ngOnInit() {
    this.subscription.add(this.oitcPermission$$.pipe(
      combineLatestWith(this.permissionService.permissions$),
      map(([oitcPermission, permissions]) => this.permissionService.checkPermission(oitcPermission, permissions)),
      filter(permit => permit),
    ).subscribe({
      next: () => this.viewContainer.createEmbeddedView(this.templateRef),
    }));
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
