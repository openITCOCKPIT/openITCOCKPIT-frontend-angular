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
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { GenericResponseWrapper } from '../../../generic-responses';

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
    RouterLink
],
    templateUrl: './hostgroups-append.component.html',
    styleUrl: './hostgroups-append.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostgroupsAppendComponent implements OnInit, OnDestroy {
    private readonly Subscription: Subscription = new Subscription();
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
    private cdr = inject(ChangeDetectorRef);

    protected submit(): void {
        const hostIds = this.route.snapshot.paramMap.get('hostids');
        if (hostIds) {
            this.post.Hostgroup.hosts._ids = hostIds.split(',').map(Number);
        }

        this.Subscription.add(this.HostgroupsService.appendHosts(this.post).subscribe((result: GenericResponseWrapper) => {
            this.cdr.markForCheck();
            const title = this.TranslocoService.translate('Host group');
            const msg = this.TranslocoService.translate('saved successfully');
            const url = ['hostgroups', 'edit', this.post.Hostgroup.id];

            this.notyService.genericSuccess(msg, title, url);
            this.HistoryService.navigateWithFallback(['/hostgroups/index']);
        }));
    }

    public ngOnInit() {
        this.Subscription.add(this.HostgroupsService.loadHostgroupsByString({} as HostgroupsLoadHostgroupsByStringParams).subscribe((data: SelectKeyValue[]) => {
            this.hostgroups = data;
            this.cdr.markForCheck();
        }));
    }

    ngOnDestroy(): void {
        this.Subscription.unsubscribe();
    }

}
