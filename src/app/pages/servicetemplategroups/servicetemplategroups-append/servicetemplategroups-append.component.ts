import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoadServicetemplategroupsByString, ServicetemplategroupsAppendPost } from '../servicetemplategroups.interface';
import { ServicetemplategroupsService } from '../servicetemplategroups.service';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { GenericValidationError } from '../../../generic-responses';
import { HistoryService } from '../../../history.service';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';

import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-servicetemplategroups-append',
    imports: [
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    FormDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    FormsModule,
    NavComponent,
    NavItemComponent,
    PermissionDirective,
    RequiredIconComponent,
    SelectComponent,
    TranslocoDirective,
    XsButtonDirective,
    ColComponent,
    RouterLink
],
    templateUrl: './servicetemplategroups-append.component.html',
    styleUrl: './servicetemplategroups-append.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicetemplategroupsAppendComponent implements OnDestroy, OnInit {

    private readonly subscriptions: Subscription = new Subscription();
    private readonly ServicetemplategroupsService: ServicetemplategroupsService = inject(ServicetemplategroupsService);
    private readonly route = inject(ActivatedRoute);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly cdr = inject(ChangeDetectorRef);

    protected errors: GenericValidationError = {} as GenericValidationError;
    protected post!: ServicetemplategroupsAppendPost;
    private preSelectedIds: number[] = [];
    protected servicetemplategroups: SelectKeyValue[] = [];

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public ngOnInit(): void {

        // preSelectedIds is used for "Append service templates to service template group from /servicetemplates/index"
        let preSelectedIds = this.route.snapshot.paramMap.get('ids');
        if (preSelectedIds !== null) {
            let idsAsString = preSelectedIds.split(',');
            this.preSelectedIds = [];
            //int ids are required for AngularJS
            for (let i in idsAsString) {
                this.preSelectedIds.push(parseInt(idsAsString[i], 10));
            }
        }

        if (preSelectedIds === null) {
            this.preSelectedIds = [];
        }

        this.post = this.getDefaultPost(this.preSelectedIds);
        this.loadServicetemplategroups('');
        this.cdr.markForCheck();
    }

    protected loadServicetemplategroups = (searchString: string, selected?: number[]) => {
        if (selected === undefined) {
            selected = [];
        }

        if (this.post.Servicetemplategroup.id) {
            selected = [this.post.Servicetemplategroup.id];
        }

        this.subscriptions.add(this.ServicetemplategroupsService.loadServicetemplategroupsByString(searchString, selected)
            .subscribe((result: LoadServicetemplategroupsByString): void => {
                this.servicetemplategroups = result.servicetemplategroups;
                this.cdr.markForCheck();
            }))

    }

    public submit(): void {

        this.errors = {};
        if (this.post.Servicetemplategroup.id < 1) {
            if (!this.errors['servicetemplategroup']) {
                this.errors['servicetemplategroup'] = {};
            }
            this.errors['servicetemplategroup']['id'] = this.TranslocoService.translate('This field cannot be left blank.');
            this.notyService.genericError();
            this.cdr.markForCheck();
            return;
        }

        this.subscriptions.add(this.ServicetemplategroupsService.append(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const title = this.TranslocoService.translate('Service template group');
                    const msg = this.TranslocoService.translate('saved successfully');
                    const url = ['servicetemplategroups', 'edit', this.post.Servicetemplategroup.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/servicetemplategroups/index']);
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;

                }
            }))
    }

    private getDefaultPost(selected: number[]): ServicetemplategroupsAppendPost {
        return {
            Servicetemplategroup: {
                id: 0,
                servicetemplates: {
                    _ids: selected
                }
            }
        }
    }

}
