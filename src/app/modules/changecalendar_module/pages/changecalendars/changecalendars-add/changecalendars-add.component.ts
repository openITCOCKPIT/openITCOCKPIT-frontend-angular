import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ChangecalendarsService } from '../changecalendars.service';
import { ContainersService } from '../../../../../pages/containers/containers.service';
import { HistoryService } from '../../../../../history.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { AddChangeCalendar } from '../changecalendars.interface';
import { ContainersLoadContainersByStringParams } from '../../../../../pages/containers/containers.interface';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckInputDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent,
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { ColorPicker } from 'primeng/colorpicker';

@Component({
    selector: 'oitc-changecalendars-add',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormCheckInputDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        ColorPicker
    ],
    templateUrl: './changecalendars-add.component.html',
    styleUrl: './changecalendars-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangecalendarsAddComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly ChangecalendarsService: ChangecalendarsService = inject(ChangecalendarsService);
    private readonly ContainersService: ContainersService = inject(ContainersService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly cdr = inject(ChangeDetectorRef);

    protected createAnother: boolean = false;
    protected post: AddChangeCalendar = this.getDefaultPost();
    protected containers: SelectKeyValue[] = [];
    protected errors: GenericValidationError = {} as GenericValidationError;

    public addChangeCalendar(): void {
        this.subscriptions.add(this.ChangecalendarsService.addChangeCalendar(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    this.cdr.markForCheck();

                    const title: string = this.TranslocoService.translate('Changecalendar');
                    const msg: string = this.TranslocoService.translate('added successfully');
                    const url: (string | number)[] = ['changecalendar_module', 'changecalendars', 'edit', result.data.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/changecalendar_module/changecalendars/index']);
                        return;
                    }
                    this.post = this.getDefaultPost();
                    this.errors = {} as GenericValidationError;
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();

                    return;
                }

                // Error
                this.notyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;
                }
            })
        );
    }

    public ngOnInit() {
        this.loadContainers();
        this.post = this.getDefaultPost();
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

    private getDefaultPost(): AddChangeCalendar {
        return {
            Changecalendar: {
                colour: '',
                container_id: 0,
                description: '',
                name: '',
            }
        };
    }
}
