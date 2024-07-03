import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Router, RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { UserMacrosModalComponent } from '../../commands/user-macros-modal/user-macros-modal.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectKeyValueWithDisabled } from '../../../layouts/primeng/select.interface';
import { GenericValidationError } from '../../../generic-responses';
import { SystemdowntimesHostPost } from '../systemdowntimes.interface';
import { HostsLoadHostsByStringParams } from '../../hosts/hosts.interface';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { HostsService } from '../../hosts/hosts.service';


@Component({
    selector: 'oitc-add-hostdowntime',
    standalone: true,
    imports: [
        CardComponent,
        CoreuiComponent,
        FaIconComponent,
        FormDirective,
        FormsModule,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        BackButtonDirective,
        CardBodyComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        UserMacrosModalComponent,
        XsButtonDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        InputGroupComponent,
        MultiSelectComponent,
        RequiredIconComponent
    ],
    templateUrl: './add-hostdowntime.component.html',
    styleUrl: './add-hostdowntime.component.css'
})
export class AddHostdowntimeComponent implements OnInit, OnDestroy {
    public hosts: SelectKeyValueWithDisabled[] = [];
    public errors: GenericValidationError | null = null;
    public post: SystemdowntimesHostPost = {} as SystemdowntimesHostPost;
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private router: Router = inject(Router);
    private readonly HostsService = inject(HostsService);
    private subscriptions: Subscription = new Subscription();

    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
    }

    public loadHosts = (searchString: string) => {
        let selected: number[] = [];
        if (this.post.object_id) {
            selected = this.post.object_id;
        }

        let params: HostsLoadHostsByStringParams = {
            angular: true,
            'filter[Hosts.name]': searchString,
            'selected[]': selected,
            includeDisabled: false
        }

        this.subscriptions.add(this.HostsService.loadHostsByString(params, true)
            .subscribe((result) => {
                this.hosts = result;
            })
        );
    }


}
