import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { StatuspagegroupPost } from '../statuspagegroups.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { StatuspagegroupsService } from '../statuspagegroups.service';
import { HistoryService } from '../../../history.service';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-statuspagegroups-edit-step-two',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        FormLoaderComponent,
        BackButtonDirective,
        BadgeComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        FormDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        ReactiveFormsModule,
        RowComponent,
        TranslocoPipe,
        XsButtonDirective
    ],
    templateUrl: './statuspagegroups-edit-step-two.component.html',
    styleUrl: './statuspagegroups-edit-step-two.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagegroupsEditStepTwoComponent implements OnInit, OnDestroy {

    public post?: StatuspagegroupPost;
    public errors: GenericValidationError | null = null;

    private subscriptions: Subscription = new Subscription();
    private readonly StatuspagegroupsService = inject(StatuspagegroupsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadStatuspagegroup(id);
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadStatuspagegroup(id: number) {
        this.subscriptions.add(this.StatuspagegroupsService.getStatuspagegroupEdit(id).subscribe(statuspagegroup => {
            this.post = statuspagegroup;
            this.cdr.markForCheck();
        }));
    }

    public submit() {
        if (!this.post) {
            return;
        }

        this.subscriptions.add(this.StatuspagegroupsService.saveStatuspagegroupEdit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Status page group');
                    const msg = this.TranslocoService.translate('updated successfully');
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
