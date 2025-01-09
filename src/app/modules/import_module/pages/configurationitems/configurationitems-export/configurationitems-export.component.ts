import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ConfigurationitemsService } from '../configurationitems.service';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';

import { NgClass, NgIf } from '@angular/common';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';

import {
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


import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import {
    ConfigurationitemsElementsExportPost,
    ConfigurationitemsElementsJsonFile
} from '../configurationitems.interface';
import { GenericValidationError } from '../../../../../generic-responses';
import { UiBlockerComponent } from '../../../../../components/ui-blocker/ui-blocker.component';
import { HttpErrorResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { DateTime } from 'luxon';

@Component({
    selector: 'oitc-configurationitems-export',
    imports: [
    FaIconComponent,
    PermissionDirective,
    TranslocoDirective,
    RouterLink,
    NgIf,
    FormLoaderComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormDirective,
    FormLabelDirective,
    FormsModule,
    NavComponent,
    NavItemComponent,
    ReactiveFormsModule,
    XsButtonDirective,
    MultiSelectComponent,
    NgClass,
    UiBlockerComponent
],
    templateUrl: './configurationitems-export.component.html',
    styleUrl: './configurationitems-export.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationitemsExportComponent implements OnInit, OnDestroy {

    public commands: SelectKeyValue[] = [];
    public timeperiods: SelectKeyValue[] = [];
    public contacts: SelectKeyValue[] = [];
    public contactgroups: SelectKeyValue[] = [];
    public servicetemplates: SelectKeyValue[] = [];
    public servicetemplategroups: SelectKeyValue[] = [];

    public post: ConfigurationitemsElementsExportPost = this.getDefaultPost();
    public errors: GenericValidationError | null = null;
    public isGenerating: boolean = false;

    private subscriptions: Subscription = new Subscription();
    private readonly ConfigurationitemsService = inject(ConfigurationitemsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.loadElementsForExport();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getDefaultPost(): ConfigurationitemsElementsExportPost {
        return {
            Configurationitems: {
                commands: {
                    _ids: []
                },
                timeperiods: {
                    _ids: []
                },
                contacts: {
                    _ids: []
                },
                contactgroups: {
                    _ids: []
                },
                servicetemplates: {
                    _ids: []
                },
                servicetemplategroups: {
                    _ids: []
                }
            }
        };
    }

    public loadElementsForExport(): void {
        this.subscriptions.add(this.ConfigurationitemsService.loadElementsForExport().subscribe(response => {
            this.cdr.markForCheck();

            this.commands = response.commands;
            this.timeperiods = response.timeperiods;
            this.contacts = response.contacts;
            this.contactgroups = response.contactgroups;
            this.servicetemplates = response.servicetemplates;
            this.servicetemplategroups = response.servicetemplategroups;
        }));
    }

    public submit() {
        this.isGenerating = true;
        this.errors = null;
        const sub = this.ConfigurationitemsService.export(this.post).subscribe({
            next: (response: ConfigurationitemsElementsJsonFile) => {
                // 200 ok
                this.isGenerating = false;
                const msg = this.TranslocoService.translate('Items have been exported successfully.');
                this.notyService.genericSuccess(msg);

                // Build the JSON File
                const jsonString: string = JSON.stringify({
                    export: response.export,
                    OPENITCOCKPIT_VERSION: response.OPENITCOCKPIT_VERSION,
                    checksum: response.checksum
                });

                const blob = new Blob([jsonString], {type: 'application/json'});

                // Open save as dialog in all browsers
                const now = DateTime.now();
                const date = now.toFormat('dd-MM-yyyy-HH-mm-ss');
                const filename = `export-${date}.json`;
                saveAs(blob, filename);

                this.cdr.markForCheck();
            },
            error: (error: HttpErrorResponse) => {
                this.isGenerating = false;
                this.errors = error.error as GenericValidationError;

                this.notyService.genericError();

                this.cdr.markForCheck();
            }
        });
        this.subscriptions.add(sub);
    }

}
