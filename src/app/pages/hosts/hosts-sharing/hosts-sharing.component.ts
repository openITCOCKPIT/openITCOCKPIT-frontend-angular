import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    AlertComponent,
    AlertHeadingDirective,
    ButtonCloseDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CodeMirrorContainerComponent
} from '../../../components/code-mirror-container/code-mirror-container.component';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { UserMacrosModalComponent } from '../../commands/user-macros-modal/user-macros-modal.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ObjectUuidComponent } from '../../../layouts/coreui/object-uuid/object-uuid.component';
import { Subscription } from 'rxjs';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { PermissionsService } from '../../../permissions/permissions.service';
import { HostsService } from '../hosts.service';
import { HostSharing } from '../hosts.interface';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-hosts-sharing',
    standalone: true,
    imports: [
        AlertComponent,
        AlertHeadingDirective,
        BackButtonDirective,
        ButtonCloseDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CodeMirrorContainerComponent,

        FaIconComponent,
        FormCheckComponent,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormSelectDirective,
        FormTextDirective,
        FormsModule,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        PermissionDirective,
        RequiredIconComponent,
        TranslocoDirective,
        TranslocoPipe,
        UserMacrosModalComponent,
        XsButtonDirective,
        RouterLink,
        ObjectUuidComponent,
        SelectComponent,
        MultiSelectComponent,
        FormLoaderComponent
    ],
    templateUrl: './hosts-sharing.component.html',
    styleUrl: './hosts-sharing.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostsSharingComponent implements OnInit, OnDestroy {

    public host?: HostSharing;
    public primaryContainerPathSelect: SelectKeyValue[] = [];
    public sharingContainers: SelectKeyValue[] = [];
    public errors: GenericValidationError | null = null;

    private readonly HostsService = inject(HostsService);
    private subscriptions: Subscription = new Subscription();
    public readonly PermissionsService = inject(PermissionsService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.HostsService.getSharing(id)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.host = result.host;
                this.primaryContainerPathSelect = result.primaryContainerPathSelect;
                this.sharingContainers = result.sharingContainers;

                // Remove primary container from sharing containers list as it would break the gui (empty select option)
                this.host.Host.hosts_to_containers_sharing._ids = this.host.Host.hosts_to_containers_sharing._ids.filter(id => id !== this.host!.Host.container_id);
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public submit() {
        if (this.host) {
            this.subscriptions.add(this.HostsService.updateSharing(this.host)
                .subscribe((result) => {
                    this.cdr.markForCheck();
                    if (result.success) {
                        const response = result.data as GenericIdResponse;
                        const title = this.TranslocoService.translate('Host sharing');
                        const msg = this.TranslocoService.translate('updated successfully');
                        const url = ['hosts', 'sharing', response.id];

                        this.notyService.genericSuccess(msg, title, url);


                        this.HistoryService.navigateWithFallback(['/hosts/index']);
                        this.notyService.scrollContentDivToTop();
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

}
