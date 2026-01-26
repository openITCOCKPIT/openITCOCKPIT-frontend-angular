import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import {
    ColComponent,
    RowComponent,
    TemplateIdDirective,
    TextColorDirective,
    WidgetStatFComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { LocalNumberPipe } from '../../../pipes/local-number.pipe';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { PackagesTotalSummary } from '../packages.interface';
import { Subscription } from 'rxjs';
import { PackagesService } from '../packages.service';
import { PermissionsService } from '../../../permissions/permissions.service';

@Component({
    selector: 'oitc-packages-summary',
    imports: [
        AsyncPipe,
        BlockLoaderComponent,
        ColComponent,
        FaIconComponent,
        LocalNumberPipe,
        RowComponent,
        TemplateIdDirective,
        TranslocoPipe,
        WidgetStatFComponent,
        TranslocoDirective,
        RouterLink,
        TextColorDirective
    ],
    templateUrl: './packages-summary.component.html',
    styleUrl: './packages-summary.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagesSummaryComponent implements OnInit, OnDestroy {

    public summary?: PackagesTotalSummary;

    private readonly subscriptions: Subscription = new Subscription();
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly PackagesService = inject(PackagesService);
    public readonly PermissionsService = inject(PermissionsService);

    public ngOnInit(): void {
        this.subscriptions.add(
            this.PackagesService.getSummary().subscribe((summary) => {
                this.summary = summary;
                this.cdr.markForCheck();
            })
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    protected readonly String = String;
}
