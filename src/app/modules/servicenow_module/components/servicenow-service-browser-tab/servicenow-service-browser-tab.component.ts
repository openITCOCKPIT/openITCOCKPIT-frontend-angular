import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ServicenowServiceBrowserResult } from '../../servicenow.interface';
import { GenericValidationError } from '../../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { ServicenowService } from '../../servicenow.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { BlockLoaderComponent } from '../../../../layouts/primeng/loading/block-loader/block-loader.component';
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-servicenow-service-browser-tab',
    standalone: true,
    imports: [
        BlockLoaderComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormSelectDirective,
        FormsModule,
        NgIf,
        RequiredIconComponent,
        TableDirective,
        TranslocoDirective,
        XsButtonDirective
    ],
    templateUrl: './servicenow-service-browser-tab.component.html',
    styleUrl: './servicenow-service-browser-tab.component.css'
})
export class ServicenowServiceBrowserTabComponent implements OnInit, OnChanges, OnDestroy {

    @Input() serviceUuid: string = '';
    @Input() lastUpdated?: Date; // Change the date to trigger an update from an external component
    @Input() allowEdit: boolean = false;

    public result?: ServicenowServiceBrowserResult;
    public errors: GenericValidationError | null = null;


    private subscriptions: Subscription = new Subscription();
    private readonly ServicenowService = inject(ServicenowService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)
    private readonly notyService = inject(NotyService);

    public ngOnInit(): void {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['serviceUuid']) {
            this.load();
            return;
        }

        // Parent component wants to trigger an update
        if (changes['lastUpdated'] && !changes['lastUpdated'].isFirstChange()) {
            this.load();
            return;
        }

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.subscriptions.add(this.ServicenowService.getServicespecificSettings(this.serviceUuid)
            .subscribe((result) => {
                this.result = result;
            })
        );
    }

    public submit() {
        if (this.result && this.result.settings) {

            this.result.settings.ServicenowServicespecificSettings.service_uuid = this.serviceUuid;

            this.subscriptions.add(this.ServicenowService.saveServicespecificSettings(this.result.settings.ServicenowServicespecificSettings)
                .subscribe((result) => {
                    if (result.success) {

                        // Store id to update the record
                        // @ts-ignore - it is NOT undefined ad this point
                        this.result.settings.ServicenowServicespecificSettings.id = result.data.id;

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
