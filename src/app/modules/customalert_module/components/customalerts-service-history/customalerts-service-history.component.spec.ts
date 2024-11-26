import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomalertsServiceHistoryComponent } from './customalerts-service-history.component';

describe('CustomalertsServiceHistoryComponent', () => {
  let component: CustomalertsServiceHistoryComponent;
  let fixture: ComponentFixture<CustomalertsServiceHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomalertsServiceHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomalertsServiceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
