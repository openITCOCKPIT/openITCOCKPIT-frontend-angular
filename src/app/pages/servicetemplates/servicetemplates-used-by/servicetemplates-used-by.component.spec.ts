import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetemplatesUsedByComponent } from './servicetemplates-used-by.component';

describe('ServicetemplatesUsedByComponent', () => {
  let component: ServicetemplatesUsedByComponent;
  let fixture: ComponentFixture<ServicetemplatesUsedByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicetemplatesUsedByComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicetemplatesUsedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
