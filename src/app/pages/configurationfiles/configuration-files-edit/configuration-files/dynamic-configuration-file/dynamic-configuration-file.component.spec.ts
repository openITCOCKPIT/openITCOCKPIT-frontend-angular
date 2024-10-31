import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicConfigurationFileComponent } from './dynamic-configuration-file.component';

describe('DynamicConfigurationFileComponent', () => {
  let component: DynamicConfigurationFileComponent;
  let fixture: ComponentFixture<DynamicConfigurationFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicConfigurationFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicConfigurationFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
