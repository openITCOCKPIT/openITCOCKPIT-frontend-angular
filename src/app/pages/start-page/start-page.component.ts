import { Component } from '@angular/core';
import {SatelliteComponent} from "../../layouts/satellite/satellite.component";
import {HeaderComponent} from "../../components/header/header.component";
import {NavigationComponent} from "../../components/navigation/navigation.component";

@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [
    SatelliteComponent,
    HeaderComponent,
    NavigationComponent
  ],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.css'
})
export class StartPageComponent {

}
