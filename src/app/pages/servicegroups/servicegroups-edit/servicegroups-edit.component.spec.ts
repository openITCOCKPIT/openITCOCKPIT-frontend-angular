import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicegroupsEditComponent } from './servicegroups-edit.component';

describe('ServicegroupsEditComponent', () => {
  let component: ServicegroupsEditComponent;
  let fixture: ComponentFixture<ServicegroupsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicegroupsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicegroupsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
