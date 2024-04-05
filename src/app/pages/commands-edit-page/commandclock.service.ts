import { Injectable } from "@angular/core";
import { interval, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommandclockService {

  // Streams immer mit $ suffixen
  private interval$: Observable<Date> = new Observable<Date>();

  public startClock() {
    this.interval$ = interval(1000).pipe(
      map(() => new Date()),
      //tap(() => console.log(new Date()))
    )
    return this.interval$;
  }

}
