import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { NgForOf, NgIf } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsergroupsService } from '../usergroups.service';
import { HistoryService } from '../../../history.service';
import { UsergroupsCopyGetRoot, UsergroupsCopyPostRoot } from '../usergroups.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'oitc-usergroups-copy',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormLoaderComponent,
        NavComponent,
        NgForOf,
        NgIf,
        PaginatorModule,
        PermissionDirective,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink
    ],
    templateUrl: './usergroups-copy.component.html',
    styleUrl: './usergroups-copy.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsergroupsCopyComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly UsergroupsService: UsergroupsService = inject(UsergroupsService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly cdr = inject(ChangeDetectorRef);

    protected usergroups: UsergroupsCopyPostRoot = {
        data: []
    } as UsergroupsCopyPostRoot;

    public ngOnInit() {
        const ids = String(this.route.snapshot.paramMap.get('ids')).split(',').map(Number);

        if (!ids) {
            // No ids given
            this.router.navigate(['/', 'usergroups', 'index']);
            return;
        }

        this.subscriptions.add(this.UsergroupsService.getUsergroupsCopy(ids).subscribe((usergroups: UsergroupsCopyGetRoot) => {
            this.cdr.markForCheck();
            for (let usergroup of usergroups.usergroups) {
                this.usergroups.data.push(
                    {
                        Source: {
                            id: usergroup.id,
                            name: usergroup.name
                        },
                        Usergroup: {
                            description: usergroup.description,
                            name: usergroup.name
                        },
                        Error: undefined
                    }
                );
            }
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public copyUsergroups() {
        this.subscriptions.add(
            this.UsergroupsService.saveUsergroupsCopy(this.usergroups).subscribe({
                next: (value: any) => {
                    this.cdr.markForCheck();
                    this.notyService.genericSuccess();
                    this.HistoryService.navigateWithFallback(['/', 'usergroups', 'index']);
                },
                error: (error: HttpErrorResponse) => {
                    this.cdr.markForCheck();
                    this.notyService.genericError();
                    this.usergroups.data = error.error.result;
                }
            })
        );
    }
}
