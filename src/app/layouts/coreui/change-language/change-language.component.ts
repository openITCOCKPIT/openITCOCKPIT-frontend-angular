import { Component } from '@angular/core';
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
  standalone: true,
  imports: [
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    IconDirective,
    TranslocoDirective
  ],
  templateUrl: './change-language.component.html',
  styleUrl: './change-language.component.css'
})
export class ChangeLanguageComponent {
  public currentLanguage = 'en';

  constructor(private TranslocoService: TranslocoService) {
  }

  public onChangedLanguage(langugage: string) {
    this.TranslocoService.setActiveLang(langugage);
    this.currentLanguage = langugage;
  }

}
