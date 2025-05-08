import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { BaseWidgetComponent } from '../../../../pages/dashboards/widgets/base-widget/base-widget.component';
import { ResourcegroupsCronjobStatus, ResourcesWidgetResponse } from '../scm-widget.interface';
import { ScmWidgetService } from '../scm-widget.service';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { BlockLoaderComponent } from '../../../../layouts/primeng/loading/block-loader/block-loader.component';
import { ColComponent, RowComponent } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-resourcegroups-cronjob-status-widget',
    imports: [
        AsyncPipe,
        BlockLoaderComponent,
        ColComponent,
        FaIconComponent,
        NgIf,
        RowComponent,
        TranslocoDirective,
        RouterLink,
        NgClass
    ],
    templateUrl: './resourcegroups-cronjob-status-widget.component.html',
    styleUrl: './resourcegroups-cronjob-status-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcegroupsCronjobStatusWidgetComponent extends BaseWidgetComponent implements OnDestroy, AfterViewInit {
    public widgetHeight: number = 0;
    public fontSize: number = 0;
    public resources!: ResourcesWidgetResponse;
    public deadline!: string;
    public cronjobStatus!: ResourcegroupsCronjobStatus;
    public deadlineExceeded!: boolean;
    private readonly ScmWidgetService = inject(ScmWidgetService);

    public override load() {
        if (this.widget) {
            this.subscriptions.add(this.ScmWidgetService.getResourcegroupsCronjobStatusWidget(this.widget)
                .subscribe((result) => {
                    this.resources = result;
                    this.deadline = result.deadline;
                    this.deadlineExceeded = result.deadlineExceeded;
                    this.cronjobStatus = result.cronjobStatus;
                    this.cdr.markForCheck();
                }));
        }
    }

    public ngAfterViewInit(): void {
        this.resizeWidget();
    }
}
