import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTabsComponent } from './dashboard-tabs.component';

describe('DashboardTabsComponent', () => {
  let component: DashboardTabsComponent;
  let fixture: ComponentFixture<DashboardTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
