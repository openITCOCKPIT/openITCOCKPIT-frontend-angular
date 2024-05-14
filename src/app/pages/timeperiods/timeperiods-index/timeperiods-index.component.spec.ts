import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeperiodsIndexComponent } from './timeperiods-index.component';

describe('TimeperiodsIndexComponent', () => {
  let component: TimeperiodsIndexComponent;
  let fixture: ComponentFixture<TimeperiodsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeperiodsIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeperiodsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
