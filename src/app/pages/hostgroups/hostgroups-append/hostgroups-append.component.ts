import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { HistoryService } from '../../../history.service';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { HostgroupsService } from '../hostgroups.service';
import { HostgroupAppend, HostgroupsLoadHostgroupsByStringParams } from '../hostgroups.interface';
import { Subscription } from 'rxjs';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';


@Component({
    selector: 'oitc-hostgroups-append',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormDirective,
        FormLabelDirective,
        FormErrorDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        PaginatorModule,
        PermissionDirective,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        AlertComponent,
        RouterLink,
        FormFeedbackComponent
    ],
    templateUrl: './hostgroups-append.component.html',
    styleUrl: './hostgroups-append.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostgroupsAppendComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly HostgroupsService: HostgroupsService = inject(HostgroupsService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    protected post: HostgroupAppend = {
        Hostgroup: {
            hosts: {
                _ids: []
            },
            id: 0
        }
    };
    protected hostgroups: SelectKeyValue[] = [];
    public errors: GenericValidationError | null = null;
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.loadHostgroups('');
        this.cdr.markForCheck();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    protected loadHostgroups = (search: string) => {
        this.subscriptions.add(this.HostgroupsService.loadHostgroupsByString({
            'filter[Containers.name]': search
        } as HostgroupsLoadHostgroupsByStringParams).subscribe((data: SelectKeyValue[]) => {
            this.hostgroups = data;
            this.cdr.markForCheck();
        }));
    }

    protected submit(): void {
        const hostIds = this.route.snapshot.paramMap.get('hostids');
        if (hostIds) {
            this.post.Hostgroup.hosts._ids = hostIds.split(',').map(Number);
        }

        this.subscriptions.add(this.HostgroupsService.appendHosts(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('Append hosts to host group');
                    const msg = this.TranslocoService.translate(' successfully');
                    const url = ['hostgroups', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    this.notyService.scrollContentDivToTop();
                    this.HistoryService.navigateWithFallback(['/hosts/index']);
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
