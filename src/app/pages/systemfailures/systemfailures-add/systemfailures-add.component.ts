import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
    FormLabelDirective,
    InputGroupComponent,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Router, RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectKeyValueWithDisabled } from '../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { SystemfailuresGet, SystemfailuresPost } from '../systemfailures.interface';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { SystemfailuresService } from '../systemfailures.service';
import { NgIf } from '@angular/common';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { DurationInputComponent } from '../../../layouts/coreui/duration-input/duration-input.component';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-systemfailures-add',
    standalone: true,
    imports: [
        CardComponent,
        CoreuiComponent,
        FaIconComponent,
        FormDirective,
        FormsModule,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        BackButtonDirective,
        CardBodyComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        InputGroupComponent,
        RequiredIconComponent,
        FormCheckComponent,
        FormCheckLabelDirective,
        FormCheckInputDirective,
        FormControlDirective,
        TrueFalseDirective,
        CardFooterComponent,
        NgIf,
        DurationInputComponent
    ],
    templateUrl: './systemfailures-add.component.html',
    styleUrl: './systemfailures-add.component.css'
})
export class SystemfailuresAddComponent implements OnInit, OnDestroy {
    public hosts: SelectKeyValueWithDisabled[] = [];
    public errors: GenericValidationError | null = null;
    public post: SystemfailuresPost = this.getClearForm();
    public get!: SystemfailuresGet;
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private router: Router = inject(Router);
    private readonly SystemfailuresService = inject(SystemfailuresService);
    private subscriptions: Subscription = new Subscription();
    public createAnother: boolean = false;

    private readonly HistoryService: HistoryService = inject(HistoryService);

    public ngOnInit(): void {
        this.subscriptions.add(this.SystemfailuresService.loadDefaults()
            .subscribe((result) => {
                let fromDate = this.parseDateTime(result.defaultValues.js_from);
                let toDate = this.parseDateTime(result.defaultValues.js_to);
                this.post.from_date = fromDate;
                this.post.from_time = result.defaultValues.from_time;
                this.post.to_date = toDate;
                this.post.to_time = result.defaultValues.to_time;
                this.post.comment = result.defaultValues.comment;
            }));
    }

    public getClearForm(): SystemfailuresPost {
        return {
            from_date: '',
            from_time: '',
            to_date: '',
            to_time: '',
            comment: ''
        };
    }

    public ngOnDestroy(): void {
    }

    private parseDateTime = function (jsStringData: string) {
        let splitData = jsStringData.split(',');
        return splitData[0].trim() + '-' + splitData[1].trim() + '-' + splitData[2].trim();
    }

    public submit() {
        this.subscriptions.add(this.SystemfailuresService.createSystemfailure(this.post)
            .subscribe((result) => {
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('System failure');
                    const msg = this.TranslocoService.translate(' created successfully');

                    this.notyService.genericSuccess(msg, title);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/systemfailures/index']);
                    }
                    // Create another
                    this.post = this.getClearForm();
                    this.errors = null;
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();

                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            })
        );
    }
}
