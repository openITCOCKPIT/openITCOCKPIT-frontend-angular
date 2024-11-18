import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventcorrelationsUsedByComponent } from './eventcorrelations-used-by.component';

describe('EventcorrelationsUsedByComponent', () => {
  let component: EventcorrelationsUsedByComponent;
  let fixture: ComponentFixture<EventcorrelationsUsedByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventcorrelationsUsedByComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventcorrelationsUsedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
