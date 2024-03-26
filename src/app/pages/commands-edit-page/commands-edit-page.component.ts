import {Component, inject} from '@angular/core';
import {SatelliteComponent} from '../../layouts/satellite/satellite.component';
import {CommandclockService} from './commandclock.service';
import {Observable, Subscription} from 'rxjs';
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
  public now: Date = new Date();
  public clock$: Observable<Date> = new Observable<Date>();
  private sub: Subscription = new Subscription();

  constructor() {
    this.clock$ = this.clock.startClock();

    this.sub.add(this.clock$.subscribe((date) => {
      this.now = date;
    }))

  }

  public stopClock() {
    this.sub.unsubscribe();
  }
}
