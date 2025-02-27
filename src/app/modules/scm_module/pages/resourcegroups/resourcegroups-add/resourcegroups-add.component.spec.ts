import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcegroupsAddComponent } from './resourcegroups-add.component';

describe('ResourcegroupsAddComponent', () => {
  let component: ResourcegroupsAddComponent;
  let fixture: ComponentFixture<ResourcegroupsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcegroupsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcegroupsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
