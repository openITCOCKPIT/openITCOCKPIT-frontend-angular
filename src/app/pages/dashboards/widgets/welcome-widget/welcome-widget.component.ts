import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { forkJoin } from 'rxjs';
import { WelcomeWidgetResponse } from '../widgets.interface';
import { StatuscountResponse } from '../../../browsers/browsers.interface';
import { TranslocoDirective } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';
import { SystemnameService } from '../../../../services/systemname.service';

@Component({
    selector: 'oitc-welcome-widget',
    imports: [
        TranslocoDirective,
        AsyncPipe
    ],
    templateUrl: './welcome-widget.component.html',
    styleUrl: './welcome-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeWidgetComponent extends BaseWidgetComponent {

    public welcome?: WelcomeWidgetResponse;
    public statuscount?: StatuscountResponse;

    public readonly SystemnameService = inject(SystemnameService);

    public override load() {
        let request = {
            statuscount: this.WidgetsService.loadStatusCount(),
            welcome: this.WidgetsService.loadWelcomeWidget()
        };

        forkJoin(request).subscribe(
            (result) => {
                this.statuscount = result.statuscount;
                this.welcome = result.welcome;
                this.cdr.markForCheck();
            });
    }

    public override resizeWidget(event: KtdResizeEnd) {
        super.resizeWidget(event);
    }

    public override layoutUpdate(event: KtdGridLayout) {
        super.layoutUpdate(event);
    }


}
