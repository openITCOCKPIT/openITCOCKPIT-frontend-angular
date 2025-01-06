import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { UserMacrosModalComponent } from '../../commands/user-macros-modal/user-macros-modal.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { AutomapsService } from '../automaps.service';
import { SelectKeyValue, SelectKeyValueString } from '../../../layouts/primeng/select.interface';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { NgForOf, NgIf } from '@angular/common';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { AutomapEntity, AutomapsMatchingHostAndServiceCounts } from '../automaps.interface';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { TemplateDiffBtnComponent } from '../../../components/template-diff-btn/template-diff-btn.component';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-automaps-add',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        FormDirective,
        FormsModule,
        ReactiveFormsModule,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        BackButtonDirective,
        NavComponent,
        NavItemComponent,
        UserMacrosModalComponent,
        XsButtonDirective,
        CardBodyComponent,
        CardFooterComponent,
        FormCheckInputDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        NgForOf,
        NgIf,
        NgOptionComponent,
        NgSelectComponent,
        RequiredIconComponent,
        SelectComponent,
        FormControlDirective,
        FormCheckComponent,
        FormCheckLabelDirective,
        TemplateDiffBtnComponent,
        TrueFalseDirective,
        DebounceDirective,
        RowComponent,
        ColComponent,
        BadgeComponent,
        TranslocoPipe
    ],
    templateUrl: './automaps-add.component.html',
    styleUrl: './automaps-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutomapsAddComponent implements OnInit, OnDestroy {

    public createAnother: boolean = false;
    public containers: SelectKeyValue[] = [];
    public fontSizesSelect: SelectKeyValueString[] = [];
    public readonly fontSizesHtml = {
        '1': 'xx-small',
        '2': 'x-small',
        '3': 'small',
        '4': 'medium',
        '5': 'large',
        '6': 'x-large',
        '7': 'xx-large'
    };
    public currentHtmlFontsize: string = 'normal';
    public post: AutomapEntity = this.getDefaultPost();
    public errors: GenericValidationError | null = null;
    public hostAndServiceCount: AutomapsMatchingHostAndServiceCounts = {
        hostCount: 0,
        serviceCount: 0,
        hostgroupCount: 0,
    };

    private subscriptions: Subscription = new Subscription();
    public readonly AutomapsService = inject(AutomapsService);
    public readonly HistoryService = inject(HistoryService);
    public readonly PermissionsService = inject(PermissionsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)
    private readonly notyService: NotyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);


    public ngOnInit(): void {
        this.fontSizesSelect = this.AutomapsService.getFontSizes();

        this.loadContainers();
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public getDefaultPost(): AutomapEntity {
        return {
            name: "",
            container_id: 0,
            description: "",

            host_regex: "",
            hostgroup_regex: "",
            service_regex: "",

            show_ok: true,
            show_warning: true,
            show_critical: true,
            show_unknown: true,
            show_acknowledged: true,
            show_downtime: true,
            show_label: true,

            group_by_host: true,
            use_paginator: true,

            font_size: "4",
            recursive: false
        };
    }

    private loadContainers(): void {
        this.subscriptions.add(this.AutomapsService.loadContainers().subscribe((containers) => {
            this.containers = containers;
            this.cdr.markForCheck();
        }))
    }

    public getMatchingHostAndServices(event: any): void {
        if (this.post.container_id > 0) {
            if (this.post.host_regex != '' || this.post.hostgroup_regex != '' || this.post.service_regex != '') {
                this.subscriptions.add(this.AutomapsService.getMatchingHostAndServices(this.post).subscribe((data) => {
                    this.hostAndServiceCount = data;
                }));
            }
            this.cdr.markForCheck();
        }
    }

    public onFontsizeChange() {
        this.currentHtmlFontsize = 'normal';
        if (this.fontSizesHtml.hasOwnProperty(this.post.font_size)) {
            // @ts-ignore
            this.currentHtmlFontsize = String(this.fontSizesHtml[this.post.font_size]);
        }
        this.cdr.markForCheck();
    }

    public submit(): void {
        this.subscriptions.add(this.AutomapsService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Auto Map');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['automaps', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/automaps/index']);
                        return;
                    }
                    this.post = this.getDefaultPost();
                    this.notyService.scrollContentDivToTop();
                    this.errors = null;
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
