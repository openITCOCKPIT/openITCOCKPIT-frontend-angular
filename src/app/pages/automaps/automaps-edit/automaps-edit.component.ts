import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SelectKeyValue, SelectKeyValueString } from '../../../layouts/primeng/select.interface';
import { AutomapEntity, AutomapsMatchingHostAndServiceCounts } from '../automaps.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
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
import { AutomapsService } from '../automaps.service';
import { HistoryService } from '../../../history.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';

@Component({
    selector: 'oitc-automaps-edit',
    standalone: true,
    imports: [
        BackButtonDirective,
        BadgeComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        CoreuiComponent,
        DebounceDirective,
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        NgIf,
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        RowComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        FormLoaderComponent
    ],
    templateUrl: './automaps-edit.component.html',
    styleUrl: './automaps-edit.component.css'
})
export class AutomapsEditComponent implements OnInit, OnDestroy {
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
    public post!: AutomapEntity;
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
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadAutomap(id);
        });
        this.fontSizesSelect = this.AutomapsService.getFontSizes();
        this.loadContainers();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadAutomap(id: number) {
        this.subscriptions.add(this.AutomapsService.getAutomapEdit(id).subscribe(automap => {
            this.post = automap;
        }));
    }

    private loadContainers(): void {
        this.subscriptions.add(this.AutomapsService.loadContainers().subscribe((containers) => {
            this.containers = containers;
        }))
    }

    public getMatchingHostAndServices(event: any): void {
        if (this.post.container_id > 0) {
            if (this.post.host_regex != '' || this.post.hostgroup_regex != '' || this.post.service_regex != '') {
                this.subscriptions.add(this.AutomapsService.getMatchingHostAndServices(this.post).subscribe((data) => {
                    this.hostAndServiceCount = data;
                }));
            }
        }
    }

    public onFontsizeChange() {
        this.currentHtmlFontsize = 'normal';
        if (this.fontSizesHtml.hasOwnProperty(this.post.font_size)) {
            // @ts-ignore
            this.currentHtmlFontsize = String(this.fontSizesHtml[this.post.font_size]);
        }
    }

    public submit(): void {
        this.subscriptions.add(this.AutomapsService.saveAutomapEdit(this.post)
            .subscribe((result) => {
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Auto Map');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['automaps', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/automaps/index']);
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
