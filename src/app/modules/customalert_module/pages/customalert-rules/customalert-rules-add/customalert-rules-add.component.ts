import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
  CardBodyComponent,
  CardComponent, CardFooterComponent,
  CardHeaderComponent,
  CardTitleDirective,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  NavComponent,
  NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';

import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { CustomAlertRule, CustomAlertRulesIndex } from '../customalert-rules.interface';
import { Subscription } from 'rxjs';
import { CustomalertRulesService } from '../customalert-rules.service';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { ContainersService } from '../../../../../pages/containers/containers.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { HistoryService } from '../../../../../history.service';
import { ContainersLoadContainersByStringParams } from '../../../../../pages/containers/containers.interface';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';

import { NgSelectComponent } from '@ng-select/ng-select';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';

import {
    RegexHelperTooltipComponent
} from '../../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';

@Component({
    selector: 'oitc-customalert-rules-add',
    imports: [
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    FormDirective,
    FormsModule,
    NavComponent,
    NavItemComponent,
    PermissionDirective,
    TranslocoDirective,
    XsButtonDirective,
    RouterLink,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    RequiredIconComponent,
    FormCheckComponent,
    TrueFalseDirective,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NgSelectComponent,
    FormControlDirective,
    CardFooterComponent,
    SelectComponent,
    RegexHelperTooltipComponent
],
    templateUrl: './customalert-rules-add.component.html',
    styleUrl: './customalert-rules-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomalertRulesAddComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly CustomAlertRulesService: CustomalertRulesService = inject(CustomalertRulesService);
    private readonly ContainersService: ContainersService = inject(ContainersService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly NotyService: NotyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);

    protected hostTags: string[] = [];
    protected hostTagsExcluded: string[] = [];
    protected serviceTags: string[] = [];
    protected serviceTagsExcluded: string[] = [];
    protected containers: SelectKeyValue[] = [];
    protected createAnother: boolean = false;
    protected result?: CustomAlertRulesIndex;
    protected hideFilter: boolean = true;
    protected selectedItems: DeleteAllItem[] = [];
    protected errors: GenericValidationError = {} as GenericValidationError;

    protected post: CustomAlertRule = this.getDefaultPost();


    public ngOnInit() {
        this.post = this.getDefaultPost();
        this.errors = {} as GenericValidationError;
        this.hostTags = [];
        this.hostTagsExcluded = [];
        this.serviceTags = [];
        this.serviceTagsExcluded = [];

        this.loadContainers();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.cdr.markForCheck();
            }));
    }


    protected addCustomAlertRule(): void {

        // Join together the data.
        this.post.host_keywords = this.hostTags.join(',');
        this.post.host_not_keywords = this.hostTagsExcluded.join(',');
        this.post.service_keywords = this.serviceTags.join(',');
        this.post.service_not_keywords = this.serviceTagsExcluded.join(',');

        this.subscriptions.add(this.CustomAlertRulesService.add(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    this.cdr.markForCheck();

                    const title: string = this.TranslocoService.translate('Custom alert rule');
                    const msg: string = this.TranslocoService.translate('added successfully');
                    const url: (string | number)[] = ['customalert_module', 'customalert_rules', 'edit', result.data.customalertRule.id];

                    this.NotyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/customalert_module/customalert_rules/index']);
                        return;
                    }

                    this.ngOnInit();
                    this.NotyService
                        .scrollContentDivToTop();

                    return;
                }

                // Error
                this.NotyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;

                    console.warn(this.errors);
                }
            })
        );
    }


    private getDefaultPost(): CustomAlertRule {
        return {
            container_id: 0,
            description: '',
            host_keywords: '',
            host_not_keywords: '',
            name: '',
            recursive: false,
            service_keywords: '',
            service_not_keywords: '',
            servicename_regex: ''
        };
    }
}
