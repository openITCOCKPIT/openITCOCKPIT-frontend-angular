import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUpdateAvailableModalComponent } from './dashboard-update-available-modal.component';

describe('DashboardUpdateAvailableModalComponent', () => {
  let component: DashboardUpdateAvailableModalComponent;
  let fixture: ComponentFixture<DashboardUpdateAvailableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardUpdateAvailableModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardUpdateAvailableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
