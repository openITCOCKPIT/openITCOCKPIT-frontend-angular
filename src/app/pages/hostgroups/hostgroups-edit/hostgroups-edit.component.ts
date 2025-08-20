import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';

import { NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ObjectUuidComponent } from '../../../layouts/coreui/object-uuid/object-uuid.component';
import { HostgroupsService } from '../hostgroups.service';
import {
    Hostgroup,
    HostgroupsEditGet,
    LoadContainersRoot,
    LoadHostsResponse,
    LoadHosttemplates
} from "../hostgroups.interface";
import { SelectComponent } from "../../../layouts/primeng/select/select/select.component";
import { MultiSelectComponent } from "../../../layouts/primeng/multi-select/multi-select/multi-select.component";
import { SelectKeyValue } from "../../../layouts/primeng/select.interface";
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-hostgroups-edit',
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
        NgIf,
        NgSelectModule,
        PermissionDirective,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        ObjectUuidComponent,
        SelectComponent,
        MultiSelectComponent,
        FormLoaderComponent,
        InputGroupComponent,
        TranslocoPipe
    ],
    templateUrl: './hostgroups-edit.component.html',
    styleUrl: './hostgroups-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostgroupsEditComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription = new Subscription();
    private HostgroupsService: HostgroupsService = inject(HostgroupsService);
    protected hosts: SelectKeyValue[] = [];
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    public errors: GenericValidationError | null = null;
    public createAnother: boolean = false;

    private readonly HistoryService: HistoryService = inject(HistoryService);

    public post!: Hostgroup;
    protected containers: SelectKeyValue[] = [];
    protected hosttemplates: SelectKeyValue[] = [];
    public tagsForSelect: string[] = [];

    private route = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadContainers();
        this.subscriptions.add(this.HostgroupsService.getEdit(id)
            .subscribe((result: HostgroupsEditGet) => {

                this.post = result.hostgroup.Hostgroup;
                if (this.post.tags) {
                    this.tagsForSelect = this.post.tags.split(',');
                }
                this.cdr.markForCheck();

                // Then force containerChange!
                this.onContainerChange();
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public submit(): void {
        this.post.tags = this.tagsForSelect.join(',');
        this.subscriptions.add(this.HostgroupsService.updateHostgroup(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response: GenericIdResponse = result.data as GenericIdResponse;

                    const title: string = this.TranslocoService.translate('Hostgroup');
                    const msg: string = this.TranslocoService.translate('added successfully');
                    const url: (string | number)[] = ['hostgroups', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/hostgroups/index']);
                        return;
                    }
                    this.errors = null;
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

    private loadContainers(): void {
        this.subscriptions.add(this.HostgroupsService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.containers = result.containers;
                this.cdr.markForCheck();
            }))
    }

    public onContainerChange(): void {
        if (!this.post.container.parent_id) {
            this.hosts = [];
            this.cdr.markForCheck();
            return;
        }
        this.loadHosts('');
        this.loadHosttemplates('');
    }

    // ARROW FUNCTIONS
    protected loadHosts = (search: string) => {
        if (!this.post.container.parent_id) {
            this.hosts = [];
            this.cdr.markForCheck();
            return;
        }
        this.subscriptions.add(this.HostgroupsService.loadHosts(this.post.container.parent_id, search, this.post.hosts._ids)
            .subscribe((result: LoadHostsResponse) => {
                this.hosts = result.hosts;
                this.cdr.markForCheck();
            }))
    }


    protected loadHosttemplates = (search: string) => {
        if (!this.post.container.parent_id) {
            this.hosttemplates = [];
            this.cdr.markForCheck();
            return;
        }
        this.subscriptions.add(this.HostgroupsService.loadHosttemplates(this.post.container.parent_id, search, this.post.hosttemplates._ids)
            .subscribe((result: LoadHosttemplates) => {
                this.hosttemplates = result.hosttemplates;
                this.cdr.markForCheck();
            }))
    }
}
