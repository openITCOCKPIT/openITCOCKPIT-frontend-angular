import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeperiodsUsedByComponent } from './timeperiods-used-by.component';

describe('TimeperiodsUsedByComponent', () => {
  let component: TimeperiodsUsedByComponent;
  let fixture: ComponentFixture<TimeperiodsUsedByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeperiodsUsedByComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeperiodsUsedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
