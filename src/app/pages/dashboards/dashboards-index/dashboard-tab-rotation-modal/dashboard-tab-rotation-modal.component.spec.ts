import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTabRotationModalComponent } from './dashboard-tab-rotation-modal.component';

describe('DashboardTabRotationModalComponent', () => {
  let component: DashboardTabRotationModalComponent;
  let fixture: ComponentFixture<DashboardTabRotationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTabRotationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTabRotationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
