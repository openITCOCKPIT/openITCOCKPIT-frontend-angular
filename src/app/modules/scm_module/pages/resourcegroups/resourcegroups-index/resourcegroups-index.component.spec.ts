import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcegroupsIndexComponent } from './resourcegroups-index.component';

describe('ResourcegroupsIndexComponent', () => {
  let component: ResourcegroupsIndexComponent;
  let fixture: ComponentFixture<ResourcegroupsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcegroupsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcegroupsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
