import { Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionsService } from "./permissions.service";
import { combineLatestWith, filter, map, ReplaySubject, Subscription } from "rxjs";

@Directive({
  selector: '[oitcPermission]',
  standalone: true
})
export class PermissionDirective implements OnInit, OnDestroy {
  private readonly permissionService = inject(PermissionsService);
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);

  private readonly subscription = new Subscription();
  private readonly oitcPermission$$ = new ReplaySubject<string | string[]>();

  @Input({required: true})
  public set oitcPermission(value: string | string[]) {

    this.oitcPermission$$.next(value);
  };

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
