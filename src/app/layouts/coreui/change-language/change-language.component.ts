import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import {
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

@Component({
    selector: 'oitc-change-language',
    imports: [
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        IconDirective,
        TranslocoDirective
    ],
    templateUrl: './change-language.component.html',
    styleUrl: './change-language.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeLanguageComponent {
    public currentLanguage = 'en_US';

    constructor(private TranslocoService: TranslocoService) {
    }

    public onChangedLanguage(langugage: string) {
        this.TranslocoService.setActiveLang(langugage);
        this.currentLanguage = langugage;
    }

}
