import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  AlertComponent,
  AlertHeadingDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  NavComponent,
  NavItemComponent
} from '@coreui/angular';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { PermissionDirective } from '../../../../../permissions/permission.directive';

import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { PaginatorModule } from 'primeng/paginator';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';

import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { MkagentPost } from '../mkagents.interface';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { MkagentsService } from '../mkagents.service';
import { HistoryService } from '../../../../../history.service';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';

import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { ROOT_CONTAINER } from '../../../../../pages/changelogs/object-types.enum';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'oitc-mkagents-edit',
    imports: [
    TranslocoDirective,
    RouterLink,
    FaIconComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    BackButtonDirective,
    NavComponent,
    NavItemComponent,
    PermissionDirective,
    XsButtonDirective,
    TranslocoDirective,
    CardBodyComponent,
    CardFooterComponent,
    PaginatorModule,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    RequiredIconComponent,
    SelectComponent,
    FormControlDirective,
    AlertComponent,
    AlertHeadingDirective,
    FormDirective,
    FormLoaderComponent,
    FormsModule
],
    templateUrl: './mkagents-edit.component.html',
    styleUrl: './mkagents-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MkagentsEditComponent implements OnInit, OnDestroy {

    public createAnother: boolean = false;
    public post!: MkagentPost;
    public errors: GenericValidationError | null = null;
    public containers: SelectKeyValue[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly MkagentsService = inject(MkagentsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);
    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;

    public ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadMkagent(id);
        });
        this.loadContainers();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadMkagent(id: number) {
        this.subscriptions.add(this.MkagentsService.getMkagentEdit(id).subscribe(mkagent => {
            this.post = mkagent;
            this.cdr.markForCheck();
        }));
    }

    public loadContainers() {
        this.subscriptions.add(
            this.MkagentsService.loadContainers().subscribe(containers => {
                this.containers = containers;
                this.cdr.detectChanges();
            })
        );
    }

    public submit() {
        this.subscriptions.add(this.MkagentsService.saveMkagentEdit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();

                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Checkmk agent');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['checkmk_module', 'mkagents', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/checkmk_module/mkagents/index']);
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
