import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HostsService } from '../hosts.service';
import { HostCopyPost } from '../hosts.interface';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-hosts-copy',
    standalone: true,
    imports: [
        AlertComponent,
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
        FormsModule,
        NavComponent,
        NgForOf,
        PermissionDirective,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        NgIf,
        FormLoaderComponent
    ],
    templateUrl: './hosts-copy.component.html',
    styleUrl: './hosts-copy.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostsCopyComponent implements OnInit, OnDestroy {

    public hosts: HostCopyPost[] = [];

    private subscriptions: Subscription = new Subscription();
    private HostsService = inject(HostsService);
    private readonly notyService = inject(NotyService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    isHostnameInUse: { [key: number]: boolean } = {};

    public ngOnInit() {
        const ids = String(this.route.snapshot.paramMap.get('ids')).split(',').map(Number);
        if (!ids) {
            // No ids given
            this.router.navigate(['/', 'hosts', 'index']);
        }

        if (ids) {
            this.subscriptions.add(this.HostsService.getHostsCopy(ids).subscribe(response => {
                for (let host of response) {

                    let h = <HostCopyPost>{
                        Source: {
                            id: host.Host.id,
                            name: host.Host.name,
                            address: host.Host.address,
                        },
                        Host: host.Host,
                        Error: null
                    };

                    delete h.Host.id; // important

                    this.hosts.push(h);
                }
                this.cdr.markForCheck();

            }));
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public checkForDuplicateHostname(hostname: string, index: number) {
        this.subscriptions.add(this.HostsService.checkForDuplicateHostname(hostname)
            .subscribe((result) => {
                this.isHostnameInUse[index] = result;
                this.cdr.markForCheck();

            })
        );
    }

    public copy() {
        const sub = this.HostsService.saveHostsCopy(this.hosts).subscribe({
            next: (value: any) => {
                //console.log(value); // Serve result with the new copied host templates
                // 200 ok
                this.notyService.genericSuccess();
                this.HistoryService.navigateWithFallback(['/', 'hosts', 'index']);
            },
            error: (error: HttpErrorResponse) => {
                // We run into a validation error.
                // Some host templates maybe already got created. For example when the user copied 3 host templates, and the first
                // two host templates where copied successfully, but the third one failed due to a validation error.
                //
                // The Server returns everything as the frontend expect it

                this.cdr.markForCheck();

                this.notyService.genericError();
                this.hosts = error.error.result as HostCopyPost[];
            }
        });

        this.subscriptions.add(sub);
    }

}
