import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TooltipDirective } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { HeaderInfo } from '../header-info.service';

@Component({
    selector: 'oitc-header-edition',
    imports: [

        TooltipDirective,
        TranslocoDirective
    ],
    templateUrl: './header-edition.component.html',
    styleUrl: './header-edition.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderEditionComponent {
    @Input({required: true}) public headerinfo: HeaderInfo = {} as HeaderInfo;
}
