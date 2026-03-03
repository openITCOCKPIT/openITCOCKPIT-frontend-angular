import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { BaseWidgetComponent } from '../../../../pages/dashboards/widgets/base-widget/base-widget.component';
import { AsyncPipe } from '@angular/common';
import {
    AccordionButtonDirective,
    AccordionComponent,
    AccordionItemComponent,
    ColComponent,
    RowComponent,
    TemplateIdDirective
} from '@coreui/angular';
import { ScmWidgetService } from '../scm-widget.service';
import { Deadline, ResourcesWidgetResponse } from '../scm-widget.interface';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { BlockLoaderComponent } from '../../../../layouts/primeng/loading/block-loader/block-loader.component';
import { PermissionDirective } from '../../../../permissions/permission.directive';

@Component({
    selector: 'oitc-my-resources-summary-widget',
    imports: [
        RowComponent,
        ColComponent,
        TranslocoDirective,
        FaIconComponent,
        AsyncPipe,
        RouterLink,
        BlockLoaderComponent,
        PermissionDirective,
        AccordionButtonDirective,
        AccordionComponent,
        AccordionItemComponent,
        TemplateIdDirective
    ],
    templateUrl: './my-resources-summary-widget.component.html',
    styleUrl: './my-resources-summary-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyResourcesSummaryWidgetComponent extends BaseWidgetComponent implements OnDestroy, AfterViewInit {
    public widgetHeight: number = 0;
    public fontSize: number = 0;
    public resources!: ResourcesWidgetResponse;
    public deadlines: Deadline[] = [];
    private readonly ScmWidgetService = inject(ScmWidgetService);

    public override load() {
        if (this.widget) {
            this.subscriptions.add(this.ScmWidgetService.getMyResourcesSummaryWidget(this.widget)
                .subscribe((result) => {
                    this.resources = result;
                    this.deadlines = result.resources.deadlines;
                    this.cdr.markForCheck();
                }));
        }
    }

    public ngAfterViewInit(): void {
        this.resizeWidget();
    }
}
