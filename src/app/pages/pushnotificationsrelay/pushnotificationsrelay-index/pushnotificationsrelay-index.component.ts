import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import {
    AlertComponent,
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
    FormLabelDirective,
    InputGroupComponent
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { RelayPost } from '../pushnotificationsrelay.interface';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { GenericValidationError } from '../../../generic-responses';

import { BackButtonDirective } from '../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { PushnotificationsrelayService } from '../pushnotificationsrelay.service';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HttpErrorResponse } from '@angular/common/http';
import { OitcAlertComponent } from '../../../components/alert/alert.component';

@Component({
    selector: 'oitc-pushnotificationsrelay-index',
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
        XsButtonDirective,
        FormLoaderComponent,
        AlertComponent,
        InputGroupComponent,
        OitcAlertComponent,
        TranslocoPipe
    ],
    templateUrl: './pushnotificationsrelay-index.component.html',
    styleUrl: './pushnotificationsrelay-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PushnotificationsrelayIndexComponent {

    public post: RelayPost = {
        id: 1, //its 1 every time
        address: "https://pushrelay.openitcockpit.io",
        port: 443,
        auth_key: "",
        enabled: true
    }
    public errors: GenericValidationError | null = null;

    // The openITCOCKPIT System ID of this system
    public systemId: string = '';

    public hasPushrelayConnectionError: boolean | null = null;
    public pushrelayErrors = {
        status: '',
        statusText: '',
        message: ''
    };

    private readonly subscriptions: Subscription = new Subscription();
    private PushnotificationsrelayService = inject(PushnotificationsrelayService);
    private readonly notyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);
    protected isLoading: boolean = true;

    public ngOnInit() {
        this.isLoading = true;
        this.subscriptions.add(
            this.PushnotificationsrelayService.getRelaySettings().subscribe(data => {
                this.post = data.relay;
                this.systemId = data.systemId;
                this.isLoading = false;
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
            this.PushnotificationsrelayService.saveRelaySettings(this.post).subscribe(data => {
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

    public checkPushrelayConnection() {
        this.hasPushrelayConnectionError = null; // Not checked yet

        const sub = this.PushnotificationsrelayService.registerAndTestToRelay(this.post).subscribe({
            next: (result) => {
                //console.log(result);
                // 200 ok

                this.hasPushrelayConnectionError = false;
                if (result.result.error) {
                    this.hasPushrelayConnectionError = true;

                    this.pushrelayErrors.status = String(result.result.status);
                    this.pushrelayErrors.statusText = result.result.reason_phrase;
                    this.pushrelayErrors.message = result.result.response_msg;
                    this.cdr.markForCheck();

                    return;
                }

                if (result.result.system?.auth_key) {
                    // Update auth_key with the one provided by the Push Gateway
                    this.post.auth_key = result.result.system.auth_key;
                }

                this.cdr.markForCheck();
            },
            error: (error: HttpErrorResponse) => {
                this.hasPushrelayConnectionError = true;

                this.pushrelayErrors.status = String(error.status);
                this.pushrelayErrors.statusText = error.statusText;
                this.pushrelayErrors.message = error.message

                this.cdr.markForCheck();
            }
        });

        this.subscriptions.add(sub);
    }

}
