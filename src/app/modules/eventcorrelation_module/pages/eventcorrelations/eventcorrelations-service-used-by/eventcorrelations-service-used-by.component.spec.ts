import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventcorrelationsServiceUsedByComponent } from './eventcorrelations-service-used-by.component';

describe('EventcorrelationsServiceUsedByComponent', () => {
  let component: EventcorrelationsServiceUsedByComponent;
  let fixture: ComponentFixture<EventcorrelationsServiceUsedByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventcorrelationsServiceUsedByComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventcorrelationsServiceUsedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
