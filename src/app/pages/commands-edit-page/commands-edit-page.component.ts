import {Component, inject, OnDestroy} from '@angular/core';
import {SatelliteComponent} from '../../layouts/satellite/satellite.component';
import {CommandclockService} from './commandclock.service';
import {Observable, Subscription} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {CommandsService} from './commands.service';
import {CommandEdit} from './CommandEdit.interface';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'oitc-commands-edit-page',
  standalone: true,
  imports: [
    SatelliteComponent,
    AsyncPipe,
    ReactiveFormsModule
  ],
  templateUrl: './commands-edit-page.component.html',
  styleUrl: './commands-edit-page.component.css'
})
export class CommandsEditPageComponent implements OnDestroy {

  // Remove this 💩
  private clock = inject(CommandclockService);
  public now: Date = new Date();
  public clock$: Observable<Date> = new Observable<Date>();
  // end of remove

  private subscriptions: Subscription = new Subscription();
  private CommandsService = inject(CommandsService);
  public command: CommandEdit | null = null;

  private readonly formBuilder = inject(FormBuilder);
  public readonly form: FormGroup = this.formBuilder.group({
    name: [''],
    command_line: [''],
    command_type: [''],
  });

  constructor() {
    $localize`Start Page`;

    this.clock$ = this.clock.startClock();

    this.subscriptions.add(this.clock$.subscribe((date) => {
      this.now = date;
    }))

    this.subscriptions.add(this.CommandsService.getEdit(3)
      .subscribe((command) => {
        this.form.patchValue(command); // update input fields
        this.command = command; // to display in template
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public stopClock() {
    this.subscriptions.unsubscribe();
  }
}
