import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAllocationsAddComponent } from './dashboard-allocations-add.component';

describe('DashboardAllocationsAddComponent', () => {
  let component: DashboardAllocationsAddComponent;
  let fixture: ComponentFixture<DashboardAllocationsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAllocationsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAllocationsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
