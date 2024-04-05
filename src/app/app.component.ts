import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';



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
  constructor(library: FaIconLibrary, private IconSetService: IconSetService) {
    // Add an icon to the library for convenient access in other components
    library.addIconPacks(fas);

    this.IconSetService.icons = { ...iconSubset };
  }
}
