import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseWidgetComponent } from '../../../../pages/dashboards/widgets/base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { AnimationEvent } from '@angular/animations';

@Component({
    selector: 'oitc-autoreport-widget',
    imports: [],
    templateUrl: './autoreport-widget.component.html',
    styleUrl: './autoreport-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoreportWidgetComponent extends BaseWidgetComponent implements AfterViewInit {

    public ngAfterViewInit(): void {
    }

    public override onAnimationStart(event: AnimationEvent) {
        super.onAnimationStart(event);
    }

    public override onAnimationDone(event: AnimationEvent) {
        super.onAnimationDone(event);
    }

    public override load() {
        super.load();
    }

    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    public override resizeWidget(event?: KtdResizeEnd) {
    }

    public override layoutUpdate(event: KtdGridLayout) {
    }
}
