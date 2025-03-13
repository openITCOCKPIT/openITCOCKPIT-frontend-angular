import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicenowSettingsIndexComponent } from './servicenow-settings-index.component';

describe('ServicenowSettingsIndexComponent', () => {
  let component: ServicenowSettingsIndexComponent;
  let fixture: ComponentFixture<ServicenowSettingsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicenowSettingsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicenowSettingsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
