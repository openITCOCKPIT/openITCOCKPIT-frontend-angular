import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafanaUserdashboardsAddComponent } from './grafana-userdashboards-add.component';

describe('GrafanaUserdashboardsAddComponent', () => {
  let component: GrafanaUserdashboardsAddComponent;
  let fixture: ComponentFixture<GrafanaUserdashboardsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrafanaUserdashboardsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrafanaUserdashboardsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
