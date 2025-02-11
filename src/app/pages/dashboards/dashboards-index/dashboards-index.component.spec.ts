import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardsIndexComponent } from './dashboards-index.component';

describe('DashboardsIndexComponent', () => {
  let component: DashboardsIndexComponent;
  let fixture: ComponentFixture<DashboardsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
