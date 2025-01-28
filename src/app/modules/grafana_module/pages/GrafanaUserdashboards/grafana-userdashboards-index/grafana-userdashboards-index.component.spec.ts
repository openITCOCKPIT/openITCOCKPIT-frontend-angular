import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafanaUserdashboardsIndexComponent } from './grafana-userdashboards-index.component';

describe('GrafanaUserdashboardsIndexComponent', () => {
  let component: GrafanaUserdashboardsIndexComponent;
  let fixture: ComponentFixture<GrafanaUserdashboardsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrafanaUserdashboardsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrafanaUserdashboardsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
