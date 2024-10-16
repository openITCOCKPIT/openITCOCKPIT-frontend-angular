import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AutomapsService } from '../automaps.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AutomapCopyPost } from '../automaps.interface';
import { HistoryService } from '../../../history.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormLabelDirective,
    NavComponent
} from '@coreui/angular';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { NgForOf, NgIf } from '@angular/common';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { PaginatorModule } from 'primeng/paginator';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';

@Component({
    selector: 'oitc-automaps-copy',
    standalone: true,
    imports: [

        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        XsButtonDirective,
        FormLoaderComponent,
        NgIf,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        NgForOf,
        PaginatorModule,
        RequiredIconComponent,
        CardFooterComponent
    ],
    templateUrl: './automaps-copy.component.html',
    styleUrl: './automaps-copy.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutomapsCopyComponent implements OnInit, OnDestroy {

    public automaps: AutomapCopyPost[] = [];
    public errors: GenericValidationError | null = null;

    private subscriptions: Subscription = new Subscription()
    private AutomapsService = inject(AutomapsService);
    private readonly notyService = inject(NotyService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        const ids = String(this.route.snapshot.paramMap.get('ids')).split(',').map(Number);
        if (!ids) {
            // No ids given
            this.router.navigate(['/', 'automaps', 'index']);
        }

        if (ids) {
            this.subscriptions.add(this.AutomapsService.getAutomapsCopy(ids).subscribe(automaps => {
                for (let automap of automaps) {
                    this.automaps.push(<AutomapCopyPost>{
                        Source: {
                            id: automap.id,
                            name: automap.name,
                        },

                        Automap: {
                            name: automap.name,
                            description: automap.description,
                            host_regex: automap.host_regex,
                            hostgroup_regex: automap.hostgroup_regex,
                            service_regex: automap.service_regex
                        },
                        Error: null
                    })
                }
                this.cdr.markForCheck();
            }));
        }
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe()
    }

    public copy() {
        const sub = this.AutomapsService.saveAutomapsCopy(this.automaps).subscribe({
            next: (value: any) => {
                //console.log(value); // Serve result with the new copied commands
                // 200 ok
                this.notyService.genericSuccess();
                this.HistoryService.navigateWithFallback(['/', 'automaps', 'index']);
            },
            error: (error: HttpErrorResponse) => {
                // We run into a validation error.
                // Some commands maybe already got created. For example when the user copied 3 commands, and the first
                // two commands where copied successfully, but the third one failed due to a validation error.
                //
                // The Server returns everything as the frontend expect it

                this.cdr.markForCheck();
                this.notyService.genericError();
                this.automaps = error.error.result as AutomapCopyPost[];
            }
        });

        this.subscriptions.add(sub);
    }
}
