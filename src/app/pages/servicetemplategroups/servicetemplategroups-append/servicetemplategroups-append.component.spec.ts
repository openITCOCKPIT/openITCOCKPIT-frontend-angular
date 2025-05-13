import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetemplategroupsAppendComponent } from './servicetemplategroups-append.component';

describe('ServicetemplategroupsAppendComponent', () => {
  let component: ServicetemplategroupsAppendComponent;
  let fixture: ComponentFixture<ServicetemplategroupsAppendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicetemplategroupsAppendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicetemplategroupsAppendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
