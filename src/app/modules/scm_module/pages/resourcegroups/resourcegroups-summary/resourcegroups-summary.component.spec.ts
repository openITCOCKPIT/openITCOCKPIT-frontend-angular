import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcegroupsSummaryComponent } from './resourcegroups-summary.component';

describe('ResourcegroupsSummaryComponent', () => {
  let component: ResourcegroupsSummaryComponent;
  let fixture: ComponentFixture<ResourcegroupsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcegroupsSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcegroupsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
