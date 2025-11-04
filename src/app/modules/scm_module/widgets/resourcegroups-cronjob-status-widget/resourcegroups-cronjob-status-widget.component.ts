import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { BaseWidgetComponent } from '../../../../pages/dashboards/widgets/base-widget/base-widget.component';
import { Deadline, ResourcegroupsCronjobStatus, ResourcesWidgetResponse } from '../scm-widget.interface';
import { ScmWidgetService } from '../scm-widget.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { BlockLoaderComponent } from '../../../../layouts/primeng/loading/block-loader/block-loader.component';
import { ColComponent, RowComponent } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { PermissionDirective } from '../../../../permissions/permission.directive';

@Component({
    selector: 'oitc-resourcegroups-cronjob-status-widget',
    imports: [
        AsyncPipe,
        BlockLoaderComponent,
        ColComponent,
        FaIconComponent,
        RowComponent,
        TranslocoDirective,
        RouterLink,
        NgClass,
        PermissionDirective
    ],
    templateUrl: './resourcegroups-cronjob-status-widget.component.html',
    styleUrl: './resourcegroups-cronjob-status-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcegroupsCronjobStatusWidgetComponent extends BaseWidgetComponent implements OnDestroy, AfterViewInit {
    public widgetHeight: number = 0;
    public fontSize: number = 0;
    public resources!: ResourcesWidgetResponse;
    public deadlines!: Deadline[];
    public cronjobStatus!: ResourcegroupsCronjobStatus;
    private readonly ScmWidgetService = inject(ScmWidgetService);

    public override load() {
        if (this.widget) {
            this.subscriptions.add(this.ScmWidgetService.getResourcegroupsCronjobStatusWidget(this.widget)
                .subscribe((result) => {
                    this.resources = result;
                    this.deadlines = result.deadlines;
                    this.cronjobStatus = result.cronjobStatus;
                    this.cdr.markForCheck();
                }));
        }
    }

    public ngAfterViewInit(): void {
        this.resizeWidget();
    }
}
