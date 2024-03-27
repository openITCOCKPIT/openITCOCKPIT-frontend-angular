import {Component, inject, OnDestroy} from '@angular/core';
import {SatelliteComponent} from '../../layouts/satellite/satellite.component';
import {CommandclockService} from './commandclock.service';
import {Observable, Subscription} from 'rxjs';
import {AsyncPipe, JsonPipe, NgFor, NgIf} from '@angular/common';
import {CommandEditService} from './CommandEditService';
import {CommandEdit} from './CommandEdit.interface';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'oitc-commands-edit-page',
  standalone: true,
  imports: [
    SatelliteComponent,
    AsyncPipe,
    FormsModule,
    NgFor,
    NgIf,
    JsonPipe
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
  private CommandEditService = inject(CommandEditService);
  public command!: CommandEdit;

  constructor() {
    $localize`Start Page`;

    this.clock$ = this.clock.startClock();

    this.subscriptions.add(this.clock$.subscribe((date) => {
      this.now = date;
    }))

    this.subscriptions.add(this.CommandsService.getEdit(3)
      .subscribe((command) => {
        this.command = command; // to display in template

        console.log('command', command);
      })
    );
  }

  public formSubmit(values: any) {
    console.log('form values', values);

    console.log('command reference', this.command);
  }

  public addCmdArgFormControl(): void {
    this.command?.commandarguments.push({
      id: 0,
      command_id: 0,
      name: '',
      human_name: '',
      created: 'heute',
      modified: 'heute',
    })
    /*
    this.cmdArgsForm.push(
      this.formBuilder.control(Math.random()), { emitEvent: true }
    );*/
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public stopClock() {
    this.subscriptions.unsubscribe();
  }

  public changeName(): void {
    this.command.name = Math.random()+'';
  }
}
