import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsarFlowTimepickerComponent } from './isar-flow-timepicker.component';

describe('IsarFlowTimepickerComponent', () => {
  let component: IsarFlowTimepickerComponent;
  let fixture: ComponentFixture<IsarFlowTimepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsarFlowTimepickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IsarFlowTimepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
