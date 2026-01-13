import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    InputGroupComponent,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';

import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';

import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import { ImportedhostgroupsService } from '../importedhostgroups.service';
import { ImportedhostgroupGet } from '../importedhostgroups.interface';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { NgSelectModule } from '@ng-select/ng-select';


@Component({
    selector: 'oitc-imported-hostgroups-view',
    imports: [
    FaIconComponent,
    PermissionDirective,
    TranslocoDirective,
    RouterLink,
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormDirective,
    FormErrorDirective,
    FormLabelDirective,
    FormsModule,
    MultiSelectComponent,
    NavComponent,
    NavItemComponent,
    ReactiveFormsModule,
    RequiredIconComponent,
    XsButtonDirective,
    FormSelectDirective,
    InputGroupComponent,
    NgSelectModule,
    TranslocoPipe
],
    templateUrl: './imported-hostgroups-view.component.html',
    styleUrl: './imported-hostgroups-view.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportedHostgroupsViewComponent implements OnInit, OnDestroy {
    public id: number = 0;
    private route = inject(ActivatedRoute);

    public importedHostgroup?: ImportedhostgroupGet;
    public containerPath: string = '';
    public importedHosts: SelectKeyValue[] = [];
    public importedHostIds: number[] = [];
    public tagsForSelect: string[] = [];

    private ImportedhostgroupsService = inject(ImportedhostgroupsService);
    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.ImportedhostgroupsService.getView(this.id)
            .subscribe((result) => {
                this.importedHostgroup = result.importedhostgroup;
                if (this.importedHostgroup.ImportedHostgroup.tags) {
                    this.tagsForSelect = this.importedHostgroup.ImportedHostgroup.tags.split(',');
                }
                if (this.importedHostgroup.ImportedHostgroup.hasOwnProperty('imported_hosts')) {
                    // @ts-ignore
                    for (let importedHost of this.importedHostgroup.ImportedHostgroup.imported_hosts) {
                        this.importedHosts.push({
                            key: importedHost.id,
                            value: importedHost.name
                        });
                        // @ts-ignore
                        this.importedHostIds.push(importedHost.id);
                    }
                }
                this.containerPath = result.containerPath;
                this.cdr.markForCheck();
            }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
