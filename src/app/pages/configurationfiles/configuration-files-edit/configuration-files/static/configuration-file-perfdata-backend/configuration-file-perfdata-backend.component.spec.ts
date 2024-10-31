import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationFilePerfdataBackendComponent } from './configuration-file-perfdata-backend.component';

describe('ConfigurationFilePerfdataBackendComponent', () => {
  let component: ConfigurationFilePerfdataBackendComponent;
  let fixture: ComponentFixture<ConfigurationFilePerfdataBackendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationFilePerfdataBackendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationFilePerfdataBackendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
