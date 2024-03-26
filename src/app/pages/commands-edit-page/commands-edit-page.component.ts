import {Component, inject} from '@angular/core';
import {SatelliteComponent} from '../../layouts/satellite/satellite.component';
import {CommandclockService} from './commandclock.service';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'oitc-commands-edit-page',
  standalone: true,
  imports: [
    SatelliteComponent,
    AsyncPipe
  ],
  templateUrl: './commands-edit-page.component.html',
  styleUrl: './commands-edit-page.component.css'
})
export class CommandsEditPageComponent {

  private clock = inject(CommandclockService);
  public now$: Observable<Date> = new Observable<Date>()

  constructor() {
    this.now$ = this.clock.startClock();

    // Unnötig aber just for fun
    const sub = this.now$.subscribe((date) => {
     console.log('Hier im commands edit page component', date);
    })
  }

  public stopClock() {

  }
}
