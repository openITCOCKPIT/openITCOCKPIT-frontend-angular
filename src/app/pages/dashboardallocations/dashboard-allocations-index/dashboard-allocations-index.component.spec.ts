import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAllocationsIndexComponent } from './dashboard-allocations-index.component';

describe('DashboardAllocationsIndexComponent', () => {
  let component: DashboardAllocationsIndexComponent;
  let fixture: ComponentFixture<DashboardAllocationsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAllocationsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAllocationsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
