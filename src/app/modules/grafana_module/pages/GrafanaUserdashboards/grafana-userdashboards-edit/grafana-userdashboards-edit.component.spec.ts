import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafanaUserdashboardsEditComponent } from './grafana-userdashboards-edit.component';

describe('GrafanaUserdashboardsEditComponent', () => {
  let component: GrafanaUserdashboardsEditComponent;
  let fixture: ComponentFixture<GrafanaUserdashboardsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrafanaUserdashboardsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrafanaUserdashboardsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
