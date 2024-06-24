import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {BackButtonDirective} from '../../../directives/back-button.directive';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective, FormDirective, FormLabelDirective, NavComponent, NavItemComponent, TooltipDirective
} from '@coreui/angular';
import {CoreuiComponent} from '../../../layouts/coreui/coreui.component';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {FormErrorDirective} from '../../../layouts/coreui/form-error.directive';
import {FormFeedbackComponent} from '../../../layouts/coreui/form-feedback/form-feedback.component';
import {FormsModule} from '@angular/forms';
import {MacrosComponent} from '../../../components/macros/macros.component';
import {NgForOf, NgIf} from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';
import {PermissionDirective} from '../../../permissions/permission.directive';
import {RequiredIconComponent} from '../../../components/required-icon/required-icon.component';
import {TranslocoDirective, TranslocoPipe, TranslocoService} from '@jsverse/transloco';
import {XsButtonDirective} from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {GenericIdResponse, GenericResponseWrapper, GenericValidationError} from '../../../generic-responses';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NotyService} from '../../../layouts/coreui/noty.service';
import {ObjectUuidComponent} from '../../../layouts/coreui/object-uuid/object-uuid.component';
import {HostgroupsService} from '../hostgroups.service';
import {
    HostgroupsEditGet,
    HostgroupsEditPostHostgroup,
    LoadContainersRoot, LoadHostsResponse,
    LoadHosttemplates
} from "../hostgroups.interface";
import {SelectComponent} from "../../../layouts/primeng/select/select/select.component";
import {MultiSelectComponent} from "../../../layouts/primeng/multi-select/multi-select/multi-select.component";
import {SelectKeyValue} from "../../../layouts/primeng/select.interface";

@Component({
    selector: 'oitc-hostgroups-edit',
    standalone: true,
    imports: [
        BackButtonDirective,
        BadgeComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
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
        MacrosComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NgSelectModule,
        PermissionDirective,
        RequiredIconComponent,
        TooltipDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        ObjectUuidComponent,
        SelectComponent,
        MultiSelectComponent
    ],
    templateUrl: './hostgroups-edit.component.html',
    styleUrl: './hostgroups-edit.component.css'
})
export class HostgroupsEditComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription = new Subscription();
    private HostgroupsService: HostgroupsService = inject(HostgroupsService);
    protected hosts: SelectKeyValue[] = [];
    private router: Router = inject(Router);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    public errors: GenericValidationError | null = null;
    public createAnother: boolean = false;

    public post: HostgroupsEditPostHostgroup = {
        container: {
            containertype_id: 0,
            id: 0,
            lft: 0,
            name: '',
            parent_id: 0,
            rght: 0,
        },
        container_id: 0,
        description: '',
        hostgroup_url: '',
        hosts: {
            _ids: []
        },
        hosttemplates: {
            _ids: []
        },
        id: 0,
        uuid: ''
    }
    protected containers: SelectKeyValue[] = [];
    protected hosttemplates: SelectKeyValue[] = [];
    private route = inject(ActivatedRoute)


    public ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        //First, load shit into the component.
        this.loadContainers();
        this.subscriptions.add(this.HostgroupsService.getEdit(id)
            .subscribe((result: HostgroupsEditGet) => {

                // Then put post where it belongs. Also unpack that bullshit
                this.post = result.hostgroup.Hostgroup;

                // Then force containerChange!
                this.onContainerChange();
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public updateHostgroup(): void {

        this.subscriptions.add(this.HostgroupsService.updateHostgroup(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                if (result.success) {
                    const response: GenericIdResponse = result.data as GenericIdResponse;

                    const title: string = this.TranslocoService.translate('Hostgroup');
                    const msg: string = this.TranslocoService.translate('added successfully');
                    const url: (string | number)[] = ['hostgroups', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.router.navigate(['/hostgroups/index']);
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

                    // This is a bit of a hack, but it's the only way to get the error message to show up in the right place.
                    if (typeof this.errors['container']['name'] !== 'undefined') {
                        this.errors['name'] = <any>this.errors['container']['name'];
                    }
                }
            })
        );
    }

    private loadContainers(): void {
        this.subscriptions.add(this.HostgroupsService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.containers = result.containers;
            }))
    }

    public onContainerChange(): void {
        if (!this.post.container.parent_id) {
            this.hosts = [];
            return;
        }
        this.loadHosts('');
        this.loadHosttemplates('');
    }

    // ARROW FUNCTIONS
    protected loadHosts = (search: string) => {
        if (!this.post.container.parent_id) {
            this.hosts = [];
            return;
        }
        this.subscriptions.add(this.HostgroupsService.loadHosts(this.post.container.parent_id, search, this.post.hosts._ids)
            .subscribe((result: LoadHostsResponse) => {
                this.hosts = result.hosts;
            }))
    }


    protected loadHosttemplates = (search: string) => {
        if (!this.post.container.parent_id) {
            this.hosttemplates = [];
            return;
        }
        this.subscriptions.add(this.HostgroupsService.loadHosttemplates(this.post.container.parent_id, search, this.post.hosttemplates._ids)
            .subscribe((result: LoadHosttemplates) => {
                this.hosttemplates = result.hosttemplates;
            }))
    }
}
