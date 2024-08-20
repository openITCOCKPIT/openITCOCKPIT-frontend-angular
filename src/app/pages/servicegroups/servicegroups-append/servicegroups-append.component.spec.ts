import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicegroupsAppendComponent } from './servicegroups-append.component';

describe('ServicegroupsAppendComponent', () => {
  let component: ServicegroupsAppendComponent;
  let fixture: ComponentFixture<ServicegroupsAppendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicegroupsAppendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicegroupsAppendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
