import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { AnimationEvent } from '@angular/animations';

@Component({
    selector: 'oitc-automap-widget',
    imports: [],
    templateUrl: './automap-widget.component.html',
    styleUrl: './automap-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutomapWidgetComponent extends BaseWidgetComponent implements AfterViewInit {

    public ngAfterViewInit(): void {
    }

    public override load() {
        super.load();
    }
    
    public override onAnimationStart(event: AnimationEvent) {
        super.onAnimationStart(event);
    }

    public override onAnimationDone(event: AnimationEvent) {
        super.onAnimationDone(event);
    }

    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    public override resizeWidget(event?: KtdResizeEnd) {
        super.resizeWidget(event);
    }

    public override layoutUpdate(event: KtdGridLayout) {
        super.layoutUpdate(event);
    }
}
