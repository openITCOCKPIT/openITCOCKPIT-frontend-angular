import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetemplategroupsAddComponent } from './servicetemplategroups-add.component';

describe('ServicetemplategroupsAddComponent', () => {
  let component: ServicetemplategroupsAddComponent;
  let fixture: ComponentFixture<ServicetemplategroupsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicetemplategroupsAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicetemplategroupsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
