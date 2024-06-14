import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetemplategroupsEditComponent } from './servicetemplategroups-edit.component';

describe('ServicetemplategroupsEditComponent', () => {
  let component: ServicetemplategroupsEditComponent;
  let fixture: ComponentFixture<ServicetemplategroupsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicetemplategroupsEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicetemplategroupsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
