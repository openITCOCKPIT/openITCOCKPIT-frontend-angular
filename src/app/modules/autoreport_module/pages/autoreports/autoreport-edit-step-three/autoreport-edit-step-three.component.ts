
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AutoreportsService } from '../autoreports.service';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective, ColComponent, RowComponent
} from '@coreui/angular';
import { NgIf, NgFor, NgForOf, AsyncPipe } from '@angular/common';
import { AutoreportObject, AutoreportPost } from '../autoreports.interface';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { AutoreportBitwiseIconComponent } from '../../../components/autoreport-bitwise-icon/autoreport-bitwise-icon.component';

@Component({
  selector: 'oitc-autoreport-edit-step-three',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NgIf,
        CardBodyComponent,
        BadgeComponent,
        RowComponent,
        TranslocoPipe,
        ColComponent,
        NgForOf,
        AsyncPipe,
        AutoreportBitwiseIconComponent,
        XsButtonDirective
    ],
  templateUrl: './autoreport-edit-step-three.component.html',
  styleUrl: './../../../assets/autoreport.css',//'./autoreport-edit-step-three.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoreportEditStepThreeComponent implements OnInit, OnDestroy {

    private route = inject(ActivatedRoute);
    private subscriptions: Subscription = new Subscription();
    private readonly AutoreportsService: AutoreportsService = inject(AutoreportsService);
    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    private cdr = inject(ChangeDetectorRef);

    public id: number = 0;
    public autoreport!: AutoreportObject;

    public ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadAutoreport();

    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadAutoreport() {
        this.subscriptions.add(this.AutoreportsService.getEditStepThree(this.id).subscribe((result) => {
            this.autoreport = result;
            this.cdr.markForCheck();
        }));
    }

    protected readonly String = String;

}
