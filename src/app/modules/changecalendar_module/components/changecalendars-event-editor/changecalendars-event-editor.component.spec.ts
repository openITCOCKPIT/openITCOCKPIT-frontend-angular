import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangecalendarsEventEditorComponent } from './changecalendars-event-editor.component';

describe('ChangecalendarsEventEditorComponent', () => {
  let component: ChangecalendarsEventEditorComponent;
  let fixture: ComponentFixture<ChangecalendarsEventEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangecalendarsEventEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangecalendarsEventEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
