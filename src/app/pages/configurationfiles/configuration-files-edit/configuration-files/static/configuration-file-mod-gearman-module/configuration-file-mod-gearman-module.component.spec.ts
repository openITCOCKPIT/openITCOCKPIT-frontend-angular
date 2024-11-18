import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationFileModGearmanModuleComponent } from './configuration-file-mod-gearman-module.component';

describe('ConfigurationFileModGearmanModuleComponent', () => {
  let component: ConfigurationFileModGearmanModuleComponent;
  let fixture: ComponentFixture<ConfigurationFileModGearmanModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationFileModGearmanModuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationFileModGearmanModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
