import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { HistoryService } from '../../../../../history.service';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  AlertComponent,
  BadgeComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleDirective,
  ColComponent,
  ContainerComponent,
  DropdownComponent,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  NavComponent,
  NavItemComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { Sla } from '../../slas/slas.interface';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import {
    RegexHelperTooltipComponent
} from '../../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';




import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { HostMappingRulesService } from '../host-mapping-rules.service';
import {
    getDefaultHostMappingRulesLoadHostsParams,
    getDefaultHostMappingRulesPost, HostMappingRulesAssignToHostsRoot,
    HostMappingRulesLoadHostsParams,
    HostMappingRulesPost,
    LoadHostsRoot
} from '../host-mapping-rules.interface';

@Component({
    selector: 'oitc-host-mapping-rules-assign-to-hosts',
    imports: [
    TranslocoDirective,
    XsButtonDirective,
    RouterLink,
    FaIconComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    NavComponent,
    NavItemComponent,
    BackButtonDirective,
    CardBodyComponent,
    PermissionDirective,
    FormDirective,
    FormsModule,
    CardFooterComponent,
    DropdownComponent,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    AlertComponent,
    NgIf,
    DebounceDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    NgSelectComponent,
    RegexHelperTooltipComponent,
    FormCheckComponent,
    TrueFalseDirective,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    RowComponent,
    ColComponent,
    BadgeComponent,
    MatSort,
    MatSortHeader,
    NgForOf,
    TableDirective,
    NgClass,
    PaginateOrScrollComponent,
    ContainerComponent,
    AsyncPipe
],
    templateUrl: './host-mapping-rules-assign-to-hosts.component.html',
    styleUrl: './host-mapping-rules-assign-to-hosts.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostMappingRulesAssignToHostsComponent implements OnInit, OnDestroy {

    private readonly HostMappingRulesService: HostMappingRulesService = inject(HostMappingRulesService);
    private readonly TranslocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private router: Router = inject(Router);

    private subscriptions: Subscription = new Subscription();

    public readonly route = inject(ActivatedRoute);
    public errors: GenericValidationError | null = null;
    public post!: HostMappingRulesPost;
    protected slaId: number = 0;
    public isHostsLoading = false;
    protected hosts: LoadHostsRoot = {} as LoadHostsRoot;
    public params!: HostMappingRulesLoadHostsParams;
    public sla: Sla = {} as Sla;
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {

        this.slaId = Number(this.route.snapshot.paramMap.get('id'));
        this.post = getDefaultHostMappingRulesPost(this.slaId);
        this.params = getDefaultHostMappingRulesLoadHostsParams(this.slaId);
        this.load();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public load() {
        this.subscriptions.add(this.HostMappingRulesService.loadAssignToHosts(this.slaId)
            .subscribe((result: HostMappingRulesAssignToHostsRoot) => {
                this.cdr.markForCheck();
                this.sla = result.sla;
                if (result.sla.host_mapping_rule !== null) {
                    if (result.sla.host_mapping_rule.host_keywords !== null && typeof result.sla.host_mapping_rule.host_keywords === 'string' && result.sla.host_mapping_rule.host_keywords.length > 0) {
                        result.sla.host_mapping_rule.host_keywords = result.sla.host_mapping_rule.host_keywords.split(',');
                    } else {
                        result.sla.host_mapping_rule.host_keywords = [];
                    }
                    if (result.sla.host_mapping_rule.host_not_keywords !== null && typeof result.sla.host_mapping_rule.host_not_keywords === 'string' && result.sla.host_mapping_rule.host_not_keywords.length > 0) {
                        result.sla.host_mapping_rule.host_not_keywords = result.sla.host_mapping_rule.host_not_keywords.split(',');
                    } else {
                        result.sla.host_mapping_rule.host_not_keywords = [];
                    }
                    if (result.sla.host_mapping_rule.service_keywords !== null && typeof result.sla.host_mapping_rule.service_keywords === 'string' && result.sla.host_mapping_rule.service_keywords.length > 0) {
                        result.sla.host_mapping_rule.service_keywords = result.sla.host_mapping_rule.service_keywords.split(',');
                    } else {
                        result.sla.host_mapping_rule.service_keywords = [];
                    }
                    if (result.sla.host_mapping_rule.service_not_keywords !== null && typeof result.sla.host_mapping_rule.service_not_keywords === 'string' && result.sla.host_mapping_rule.service_not_keywords.length > 0) {
                        result.sla.host_mapping_rule.service_not_keywords = result.sla.host_mapping_rule.service_not_keywords.split(',');
                    } else {
                        result.sla.host_mapping_rule.service_not_keywords = [];
                    }
                    this.post = result.sla.host_mapping_rule;
                }
                this.loadHosts();
            }));
    }

    public submit(saveHostMappingRule: boolean = false): void {
        this.post.save_options = saveHostMappingRule;
        this.post.filter = {
            'Hosts.name': this.post.hostname_regex,
            'Hosts.keywords': (this.post.host_keywords !== null ? this.post.host_keywords : []),
            'Hosts.not_keywords': (this.post.host_not_keywords !== null ? this.post.host_not_keywords : []),
            'servicename': this.post.servicename_regex,
            'Services.keywords': (this.post.service_keywords !== null ? this.post.service_keywords : []),
            'Services.not_keywords': (this.post.service_not_keywords !== null ? this.post.service_not_keywords : []),
        };
        this.post.host_keywords = (Array.isArray(this.post.host_keywords)) ? this.post.host_keywords.join(',') : this.post.host_keywords;
        this.post.host_not_keywords = (Array.isArray(this.post.host_not_keywords)) ? this.post.host_not_keywords.join(',') : this.post.host_not_keywords;
        this.post.service_keywords = (Array.isArray(this.post.service_keywords)) ? this.post.service_keywords.join(',') : this.post.service_keywords;
        this.post.service_not_keywords = (Array.isArray(this.post.service_not_keywords)) ? this.post.service_not_keywords.join(',') : this.post.service_not_keywords;

        this.subscriptions.add(this.HostMappingRulesService.assignToHosts(this.post, this.slaId)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Data');
                    const msg = this.TranslocoService.translate('saved successfully');

                    this.notyService.genericSuccess(msg, title);

                    this.HistoryService.navigateWithFallback(['/sla_module/slas/index']);
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

    private loadHosts(): void {

        this.params['slaId'] = this.sla.id;
        this.params['filter[Hosts.name]'] = this.post.hostname_regex;
        this.params['filter[hostdescription]'] = this.post.description;
        this.params['filter[Hosts.keywords][]'] = (this.post.host_keywords !== null ? this.post.host_keywords : []);
        this.params['filter[Hosts.not_keywords][]'] = (this.post.host_not_keywords !== null ? this.post.host_not_keywords : []);
        this.params['filter[servicename]'] = this.post.servicename_regex;
        this.params['filter[Services.keywords][]'] = (this.post.service_keywords !== null ? this.post.service_keywords : []);
        this.params['filter[Services.not_keywords][]'] = (this.post.service_not_keywords !== null ? this.post.service_not_keywords : []);
        this.params['resolveContainerIds'] = true;
        this.params['onlyUnassigned'] = this.post.only_unassigned;

        this.isHostsLoading = true;
        this.subscriptions.add(this.HostMappingRulesService.loadHosts(this.params)
            .subscribe((result: LoadHostsRoot) => {
                this.hosts = result;
                this.isHostsLoading = false;
                this.cdr.markForCheck();
            }))
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadHosts();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadHosts();
        }
    }

    public onPostChange() {
        this.params.page = 1;
        this.loadHosts();
    }

}
