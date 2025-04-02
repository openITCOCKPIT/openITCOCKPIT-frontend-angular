import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import {
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective
} from '@coreui/angular';

import { ChangeLanguageService } from './change-language.service';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../../pages/profile/profile.service';
import { NgSelectConfig } from '@ng-select/ng-select';


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
export class ChangeLanguageComponent implements OnDestroy {
    public currentLanguage = 'en_US';

    private subscriptions: Subscription = new Subscription();
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    constructor(private TranslocoService: TranslocoService,
                private ChangeLanguageService: ChangeLanguageService,
                private selectConfig: NgSelectConfig,
                private ProfileService: ProfileService) {
        this.subscriptions.add(this.ProfileService.getProfile().subscribe(data => {
            if (data.user && data.user.i18n) {
                this.TranslocoService.setActiveLang(data.user.i18n);
                this.currentLanguage = data.user.i18n;
                setTimeout(() => {this.setSelectConfig();}, 100);

            }
        }));

    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public onChangedLanguage(language: string) {

        this.subscriptions.add(this.ChangeLanguageService.changeBackendLanguage(language).subscribe(data => {
            //location.reload();

            this.TranslocoService.setActiveLang(language);
            this.currentLanguage = language;
            this.cdr.markForCheck();
            setTimeout(() => {this.setSelectConfig();},100);
        }));
        //this.TranslocoService.setActiveLang(langugage);
        //this.currentLanguage = langugage

    }

    protected setSelectConfig() {
        this.selectConfig.notFoundText = this.TranslocoService.translate('No entries match the selection');
        this.selectConfig.placeholder = this.TranslocoService.translate('Please choose');
    }

}
