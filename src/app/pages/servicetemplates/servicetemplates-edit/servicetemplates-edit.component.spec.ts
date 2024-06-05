import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetemplatesEditComponent } from './servicetemplates-edit.component';

describe('ServicetemplatesEditComponent', () => {
  let component: ServicetemplatesEditComponent;
  let fixture: ComponentFixture<ServicetemplatesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicetemplatesEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicetemplatesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
