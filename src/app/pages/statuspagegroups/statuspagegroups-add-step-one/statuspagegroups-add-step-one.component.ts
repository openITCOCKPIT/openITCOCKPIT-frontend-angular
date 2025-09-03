import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Router, RouterLink } from '@angular/router';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { StatuspagegroupPost } from '../statuspagegroups.interface';
import { StatuspagegroupsService } from '../statuspagegroups.service';
import { HistoryService } from '../../../history.service';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';

@Component({
    selector: 'oitc-statuspagegroups-add-step-one',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        SelectComponent,
        TranslocoPipe,
        BadgeComponent,
        ColComponent,
        RowComponent
    ],
    templateUrl: './statuspagegroups-add-step-one.component.html',
    styleUrl: './statuspagegroups-add-step-one.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagegroupsAddStepOneComponent implements OnInit, OnDestroy {

    public post: StatuspagegroupPost = this.getDefaultPost();
    public errors: GenericValidationError | null = null;

    public containers: SelectKeyValue[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly StatuspagegroupsService = inject(StatuspagegroupsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly router: Router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.loadContainers();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadContainers() {
        this.subscriptions.add(this.StatuspagegroupsService.loadContainers()
            .subscribe((result) => {
                this.containers = result;
                this.cdr.markForCheck();
            })
        );
    }

    private getDefaultPost(): StatuspagegroupPost {
        return {
            name: '',
            description: '',
            container_id: 0,
            statuspagegroup_categories: [],
            statuspagegroup_collections: [],
            statuspages_memberships: []
        }
    }

    public submit() {
        this.subscriptions.add(this.StatuspagegroupsService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Status page group');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['statuspagegroups', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.notyService.scrollContentDivToTop();

                    this.router.navigate(['/statuspagegroups/editStepTwo/', response.id]);
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
