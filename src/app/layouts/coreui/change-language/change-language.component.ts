import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import {
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective
} from '@coreui/angular';

import { ChangeLanguageService } from './change-language.service';
import { Subscription } from 'rxjs';
import {ProfileService} from '../../../pages/profile/profile.service';


@Component({
    selector: 'oitc-change-language',
    imports: [
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    TranslocoDirective
],
    templateUrl: './change-language.component.html',
    styleUrl: './change-language.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeLanguageComponent implements OnDestroy  {
    public currentLanguage = 'en_US';

    private subscriptions: Subscription = new Subscription();

    constructor(private TranslocoService: TranslocoService,
                private ChangeLanguageService: ChangeLanguageService,
                private ProfileService: ProfileService)
    {
        this.subscriptions.add(this.ProfileService.getProfile().subscribe(data => {
            if(data.user && data.user.i18n){
                this.TranslocoService.setActiveLang(data.user.i18n);
                this.currentLanguage = data.user.i18n;

            }
        }));

    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public onChangedLanguage(langugage: string) {

        this.subscriptions.add(this.ChangeLanguageService.changeBackendLanguage(langugage).subscribe(data => {
            location.reload();
        }));
        //this.TranslocoService.setActiveLang(langugage);
        //this.currentLanguage = langugage
    }

}
