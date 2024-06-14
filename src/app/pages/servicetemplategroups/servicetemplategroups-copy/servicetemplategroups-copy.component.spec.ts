import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetemplategroupsCopyComponent } from './servicetemplategroups-copy.component';

describe('ServicetemplategroupsCopyComponent', () => {
  let component: ServicetemplategroupsCopyComponent;
  let fixture: ComponentFixture<ServicetemplategroupsCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicetemplategroupsCopyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicetemplategroupsCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
