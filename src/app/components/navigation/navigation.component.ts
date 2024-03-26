import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faChevronUp, faTachometer, IconDefinition} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'oitc-navigation',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  public readonly faChevronUp :IconDefinition = faChevronUp;
  public readonly faTachometer :IconDefinition = faTachometer;
}
