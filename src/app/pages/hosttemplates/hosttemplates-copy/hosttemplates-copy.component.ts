import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormLabelDirective,
    NavComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { HosttemplatesService } from '../hosttemplates.service';
import { HosttemplateCommandArgument, HosttemplateCopyPost } from '../hosttemplates.interface';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { HttpErrorResponse } from '@angular/common/http';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-hosttemplates-copy',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        NavComponent,
        NgForOf,
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        FormsModule,
        SelectComponent,
        AlertComponent,
        FormLoaderComponent,
        NgIf
    ],
    templateUrl: './hosttemplates-copy.component.html',
    styleUrl: './hosttemplates-copy.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HosttemplatesCopyComponent implements OnInit, OnDestroy {

    public hosttemplates: HosttemplateCopyPost[] = [];
    public commands: SelectKeyValue[] = [];

    private subscriptions: Subscription = new Subscription();
    private HosttemplatesService = inject(HosttemplatesService);
    private readonly notyService = inject(NotyService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        const ids = String(this.route.snapshot.paramMap.get('ids')).split(',').map(Number);
        if (!ids) {
            // No ids given
            this.router.navigate(['/', 'hosttemplates', 'index']);
        }

        if (ids) {
            this.subscriptions.add(this.HosttemplatesService.getHosttemplatesCopy(ids).subscribe(response => {
                for (let hosttemplate of response.hosttemplates) {

                    let ht = <HosttemplateCopyPost>{
                        Source: {
                            id: hosttemplate.id,
                            name: hosttemplate.name
                        },
                        Hosttemplate: hosttemplate,
                        Error: null
                    };
                    ht.Hosttemplate.hosttemplatecommandargumentvalues = this.removeFieldsFromHosttemplatecommandargumentvalues(ht.Hosttemplate.hosttemplatecommandargumentvalues);

                    delete ht.Hosttemplate.id; // important

                    this.hosttemplates.push(ht);
                }

                this.commands = response.commands;
                this.cdr.markForCheck();
            }));
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadCommandArguments(sourceHosttemplateId: number, commandId: number, index: number) {
        this.subscriptions.add(this.HosttemplatesService.loadCommandArgumentsForCopy(commandId, sourceHosttemplateId).subscribe(response => {
            this.hosttemplates[index].Hosttemplate.hosttemplatecommandargumentvalues = response;
            this.cdr.markForCheck();
        }));
    }

    private removeFieldsFromHosttemplatecommandargumentvalues(hosttemplatecommandargumentvalues: HosttemplateCommandArgument[]) {
        if (hosttemplatecommandargumentvalues.length === 0) {
            return [];
        }

        for (var i in hosttemplatecommandargumentvalues) {
            delete hosttemplatecommandargumentvalues[i].id;
            delete hosttemplatecommandargumentvalues[i].hosttemplate_id;
        }

        this.cdr.markForCheck();
        return hosttemplatecommandargumentvalues;
    }

    public copy() {
        const sub = this.HosttemplatesService.saveHosttemplatesCopy(this.hosttemplates).subscribe({
            next: (value: any) => {
                //console.log(value); // Serve result with the new copied host templates
                // 200 ok
                this.notyService.genericSuccess();
                this.HistoryService.navigateWithFallback(['/', 'hosttemplates', 'index']);
            },
            error: (error: HttpErrorResponse) => {
                // We run into a validation error.
                // Some host templates maybe already got created. For example when the user copied 3 host templates, and the first
                // two host templates where copied successfully, but the third one failed due to a validation error.
                //
                // The Server returns everything as the frontend expect it

                this.notyService.genericError();
                this.hosttemplates = error.error.result as HosttemplateCopyPost[];
                this.cdr.markForCheck();
            }
        });

        this.subscriptions.add(sub);
    }

}
