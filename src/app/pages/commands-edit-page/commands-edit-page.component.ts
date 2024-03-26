import { Component } from '@angular/core';
import {SatelliteComponent} from '../../layouts/satellite/satellite.component';

@Component({
  selector: 'oitc-commands-edit-page',
  standalone: true,
  imports: [
    SatelliteComponent
  ],
  templateUrl: './commands-edit-page.component.html',
  styleUrl: './commands-edit-page.component.css'
})
export class CommandsEditPageComponent {

}
