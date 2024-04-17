import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandsAddComponent } from './commands-add.component';

describe('CommandsIndexComponent', () => {
  let component: CommandsAddComponent;
  let fixture: ComponentFixture<CommandsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
