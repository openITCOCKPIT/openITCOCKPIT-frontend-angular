import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcegroupsEditComponent } from './resourcegroups-edit.component';

describe('ResourcegroupsAddComponent', () => {
  let component: ResourcegroupsEditComponent;
  let fixture: ComponentFixture<ResourcegroupsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcegroupsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcegroupsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
