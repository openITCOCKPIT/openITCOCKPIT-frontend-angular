import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import 'flag-icons';
import { HistoryService } from './history.service';
import { TranslocoService } from '@jsverse/transloco';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
    selector: 'oitc-root',
    standalone: true,
    imports: [
        RouterOutlet,
        FontAwesomeModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {

    // Inject HistoryService to keep track of the previous URLs
    private historyService: HistoryService = inject(HistoryService);

    constructor(library: FaIconLibrary,
                private IconSetService: IconSetService,
                private selectConfig: NgSelectConfig,
                private TranslocoService: TranslocoService
    ) {
        // Add an icon to the library for convenient access in other components
        library.addIconPacks(fas);

        this.IconSetService.icons = {...iconSubset};

        this.selectConfig.notFoundText = this.TranslocoService.translate('No entries match the selection');
        this.selectConfig.placeholder = this.TranslocoService.translate('Please choose');
    }
}
