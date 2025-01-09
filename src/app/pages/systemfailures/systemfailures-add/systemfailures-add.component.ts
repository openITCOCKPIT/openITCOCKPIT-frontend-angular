import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AlertComponent,
  AlertHeadingDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleDirective,
  ColComponent,
  FormCheckInputDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
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
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { SystemfailuresGet, SystemfailuresPost } from '../systemfailures.interface';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { SystemfailuresService } from '../systemfailures.service';

import { HistoryService } from '../../../history.service';
import { FakeSelectComponent } from '../../../layouts/coreui/fake-select/fake-select.component';


@Component({
    selector: 'oitc-systemfailures-add',
    imports: [
    CardComponent,
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
    RequiredIconComponent,
    FormCheckInputDirective,
    FormControlDirective,
    CardFooterComponent,
    FakeSelectComponent,
    AlertComponent,
    ColComponent,
    AlertHeadingDirective
],
    templateUrl: './systemfailures-add.component.html',
    styleUrl: './systemfailures-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemfailuresAddComponent implements OnInit, OnDestroy {
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
    private cdr = inject(ChangeDetectorRef);

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
                this.post.author = result.author;
                this.cdr.markForCheck();
            }));
    }

    public getClearForm(): SystemfailuresPost {
        return {
            from_date: '',
            from_time: '',
            to_date: '',
            to_time: '',
            comment: '',
            author: {
                fullname: ''
            }
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
                this.cdr.markForCheck();
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
