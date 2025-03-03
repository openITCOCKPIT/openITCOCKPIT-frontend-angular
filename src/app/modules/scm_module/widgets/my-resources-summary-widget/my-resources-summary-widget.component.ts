import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    OnDestroy,
    ViewChild
} from '@angular/core';
import { BaseWidgetComponent } from '../../../../pages/dashboards/widgets/base-widget/base-widget.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { ColComponent, RowComponent } from '@coreui/angular';
import { ScmWidgetService } from '../scm-widget.service';
import { KtdResizeEnd } from '@katoid/angular-grid-layout';
import { ResourcesWidgetResponse } from '../scm-widget.interface';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { BlockLoaderComponent } from '../../../../layouts/primeng/loading/block-loader/block-loader.component';

@Component({
    selector: 'oitc-my-resources-summary-widget',
    imports: [
        NgIf,
        RowComponent,
        ColComponent,
        TranslocoDirective,
        FaIconComponent,
        AsyncPipe,
        RouterLink,
        BlockLoaderComponent
    ],
    templateUrl: './my-resources-summary-widget.component.html',
    styleUrl: './my-resources-summary-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyResourcesSummaryWidgetComponent extends BaseWidgetComponent implements OnDestroy, AfterViewInit {
    public widgetHeight: number = 0;
    public fontSize: number = 0;
    public resources!: ResourcesWidgetResponse;
    public deadline!: string;
    public deadlineExceeded!: boolean;
    private readonly ScmWidgetService = inject(ScmWidgetService);
    @ViewChild('scmWidgetContainer') scmWidgetContainer?: ElementRef;

    public override load() {
        if (this.widget) {
            this.subscriptions.add(this.ScmWidgetService.getMyResourcesSummaryWidget(this.widget)
                .subscribe((result) => {
                    this.resources = result;
                    this.deadline = result.deadline;
                    this.deadlineExceeded = result.deadlineExceeded;
                    this.cdr.markForCheck();
                }));
        }
    }

    public override resizeWidget(event?: KtdResizeEnd) {
        this.widgetHeight = this.scmWidgetContainer?.nativeElement.offsetHeight;
        this.fontSize = this.widgetHeight / 3.5;
        this.cdr.markForCheck();
    }

    public ngAfterViewInit(): void {
        this.resizeWidget();
    }
}
