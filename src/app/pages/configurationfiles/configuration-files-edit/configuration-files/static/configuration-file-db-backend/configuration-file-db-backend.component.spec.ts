import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationFileDbBackendComponent } from './configuration-file-db-backend.component';

describe('ConfigurationFileDbBackendComponent', () => {
  let component: ConfigurationFileDbBackendComponent;
  let fixture: ComponentFixture<ConfigurationFileDbBackendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationFileDbBackendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationFileDbBackendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
