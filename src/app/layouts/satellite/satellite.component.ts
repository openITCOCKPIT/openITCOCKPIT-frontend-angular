import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'oitc-satellite',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './satellite.component.html',
  styleUrl: './satellite.component.css'
})
export class SatelliteComponent {

}
