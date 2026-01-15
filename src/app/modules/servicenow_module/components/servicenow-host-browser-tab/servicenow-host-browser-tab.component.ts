import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServicenowService } from '../../servicenow.service';
import { ServicenowHostBrowserResult } from '../../servicenow.interface';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    TableDirective
} from '@coreui/angular';

import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormErrorDirective } from '../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { GenericValidationError } from '../../../../generic-responses';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BlockLoaderComponent } from '../../../../layouts/primeng/loading/block-loader/block-loader.component';
import { NotyService } from '../../../../layouts/coreui/noty.service';

@Component({
    selector: 'oitc-servicenow-host-browser-tab',
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        TranslocoDirective,
        FaIconComponent,
        TableDirective,
        FormDirective,
        FormsModule,
        ReactiveFormsModule,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        CardFooterComponent,
        XsButtonDirective,
        FormSelectDirective,
        BlockLoaderComponent
    ],
    templateUrl: './servicenow-host-browser-tab.component.html',
    styleUrl: './servicenow-host-browser-tab.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicenowHostBrowserTabComponent implements OnDestroy {

    hostUuid = input<string>('');
    lastUpdated = input<Date>(); // Change the date to trigger an update from an external component
    allowEdit = input<boolean>(false);


    public result?: ServicenowHostBrowserResult;
    public errors: GenericValidationError | null = null;


    private subscriptions: Subscription = new Subscription();
    private readonly ServicenowService = inject(ServicenowService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)
    private readonly notyService = inject(NotyService);

    private cdr = inject(ChangeDetectorRef);

    constructor() {
        effect(() => {
            if (this.hostUuid() !== '') {
                this.load();
                return;
            }

            if (this.lastUpdated()) {
                this.load();
                return;
            }
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.subscriptions.add(this.ServicenowService.getHostspecificSettings(this.hostUuid())
            .subscribe((result) => {
                this.result = result;
                this.cdr.markForCheck();
            })
        );
    }

    public submit() {
        if (this.result && this.result.settings) {

            this.result.settings.ServicenowHostspecificSettings.host_uuid = this.hostUuid();

            this.subscriptions.add(this.ServicenowService.saveHostspecificSettings(this.result.settings.ServicenowHostspecificSettings)
                .subscribe((result) => {
                    this.cdr.markForCheck();
                    if (result.success) {

                        // Store id to update the record
                        // @ts-ignore - it is NOT undefined ad this point
                        this.result.settings.ServicenowHostspecificSettings.id = result.data.id;

                        this.notyService.genericSuccess();
                        return;
                    }

                    // Error
                    const errorResponse = result.data as GenericValidationError;
                    this.notyService.genericError();
                    if (result) {
                        this.errors = errorResponse;
                    }
                }));
        }
    }

}
