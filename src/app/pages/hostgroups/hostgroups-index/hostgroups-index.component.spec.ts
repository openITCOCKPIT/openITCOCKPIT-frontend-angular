import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostgroupsIndexComponent } from './hostgroups-index.component';

describe('HostgroupsIndexComponent', () => {
  let component: HostgroupsIndexComponent;
  let fixture: ComponentFixture<HostgroupsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostgroupsIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HostgroupsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
