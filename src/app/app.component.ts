import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import 'flag-icons';
import { HistoryService } from './history.service';
import { TranslocoService } from '@jsverse/transloco';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ContainerComponent } from '@coreui/angular';
import { CoreuiFooterComponent } from './layouts/coreui/coreui-footer/coreui-footer.component';
import { CoreuiHeaderComponent } from './layouts/coreui/coreui-header/coreui-header.component';
import { CoreuiNavbarComponent } from './layouts/coreui/coreui-navbar/coreui-navbar.component';
import { GlobalLoaderComponent } from './layouts/coreui/global-loader/global-loader.component';

@Component({
    selector: 'oitc-root',
    standalone: true,
    imports: [
        RouterOutlet,
        FontAwesomeModule,
        ContainerComponent,
        CoreuiFooterComponent,
        CoreuiHeaderComponent,
        CoreuiNavbarComponent,
        GlobalLoaderComponent
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
        library.addIconPacks(far);
        library.addIconPacks(fab);

        this.IconSetService.icons = {...iconSubset};

        this.selectConfig.notFoundText = this.TranslocoService.translate('No entries match the selection');
        this.selectConfig.placeholder = this.TranslocoService.translate('Please choose');
    }
}
