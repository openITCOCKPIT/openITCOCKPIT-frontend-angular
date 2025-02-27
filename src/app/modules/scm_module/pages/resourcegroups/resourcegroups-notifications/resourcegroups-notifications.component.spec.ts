import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcegroupsNotificationsComponent } from './resourcegroups-notifications.component';

describe('ResourcegroupsNotificationsComponent', () => {
  let component: ResourcegroupsNotificationsComponent;
  let fixture: ComponentFixture<ResourcegroupsNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcegroupsNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcegroupsNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
