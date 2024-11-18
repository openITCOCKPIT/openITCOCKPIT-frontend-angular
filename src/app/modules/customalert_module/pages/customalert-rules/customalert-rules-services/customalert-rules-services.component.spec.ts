import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomalertRulesServicesComponent } from './customalert-rules-services.component';

describe('CustomalertRulesServicesComponent', () => {
  let component: CustomalertRulesServicesComponent;
  let fixture: ComponentFixture<CustomalertRulesServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomalertRulesServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomalertRulesServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
