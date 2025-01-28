import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafanaConfigurationIndexComponent } from './grafana-configuration-index.component';

describe('GrafanaConfigurationIndexComponent', () => {
  let component: GrafanaConfigurationIndexComponent;
  let fixture: ComponentFixture<GrafanaConfigurationIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrafanaConfigurationIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrafanaConfigurationIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
