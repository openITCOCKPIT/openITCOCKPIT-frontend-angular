import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import {
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleDirective,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { ProxyPost } from '../proxy.interface';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { GenericValidationError } from '../../../generic-responses';

import { BackButtonDirective } from '../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ProxyService } from '../proxy.service';

@Component({
    selector: 'oitc-proxy-index',
    imports: [
    FaIconComponent,
    PermissionDirective,
    TranslocoDirective,
    RouterLink,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormDirective,
    FormsModule,
    FormControlDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    RequiredIconComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    BackButtonDirective,
    CardFooterComponent,
    XsButtonDirective
],
    templateUrl: './proxy-index.component.html',
    styleUrl: './proxy-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProxyIndexComponent implements OnInit, OnDestroy {

    public post: ProxyPost = {
        id: 1, //its 1 every time
        ipaddress: "",
        port: 8080,
        enabled: false
    }
    public errors: GenericValidationError | null = null;

    private readonly subscriptions: Subscription = new Subscription();
    private ProxyService = inject(ProxyService);
    private readonly notyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.subscriptions.add(
            this.ProxyService.getProxySettings().subscribe(data => {
                this.post = data;
                this.cdr.markForCheck();
            })
        );
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public submit() {
        this.errors = null;

        this.subscriptions.add(
            this.ProxyService.saveProxySettings(this.post).subscribe(data => {
                this.cdr.markForCheck();

                if (data.success) {
                    this.notyService.genericSuccess();
                } else {
                    this.notyService.genericError();
                    this.errors = data.data as GenericValidationError;
                }
            })
        );
    }

}
