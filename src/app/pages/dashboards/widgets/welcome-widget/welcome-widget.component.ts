import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { forkJoin, Observable } from 'rxjs';
import { WelcomeWidgetResponse } from '../widgets.interface';
import { StatuscountResponse } from '../../../browsers/browsers.interface';
import { TranslocoDirective } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';
import { SystemnameService } from '../../../../services/systemname.service';
import { Avatar } from 'primeng/avatar';
import initials from 'initials';
import { LocalNumberPipe } from '../../../../pipes/local-number.pipe';
import { WordLoaderComponent } from '../../../../layouts/primeng/loading/word-loader/word-loader.component';

@Component({
    selector: 'oitc-welcome-widget',
    imports: [
        TranslocoDirective,
        AsyncPipe,
        Avatar,
        LocalNumberPipe,
        WordLoaderComponent
    ],
    templateUrl: './welcome-widget.component.html',
    styleUrl: './welcome-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeWidgetComponent extends BaseWidgetComponent {

    public welcome?: WelcomeWidgetResponse;
    public statuscount?: StatuscountResponse;

    public nameInitials = ''; // Unknown User

    public readonly SystemnameService = inject(SystemnameService);

    public override load() {
        let request = {
            statuscount: this.WidgetsService.loadStatusCount(),
            welcome: this.WidgetsService.loadWelcomeWidget()
        };

        forkJoin<{
            statuscount: Observable<StatuscountResponse>;
            welcome: Observable<WelcomeWidgetResponse>;
        }>(request).subscribe(
            (result) => {
                this.statuscount = result.statuscount;
                this.welcome = result.welcome;

                this.nameInitials = initials(result.welcome.user_fullname);

                this.cdr.markForCheck();
            });
    }

    public override resizeWidget(event: KtdResizeEnd) {
    }

    public override layoutUpdate(event: KtdGridLayout) {
    }


}
