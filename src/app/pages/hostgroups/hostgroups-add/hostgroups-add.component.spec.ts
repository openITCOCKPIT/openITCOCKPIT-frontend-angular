import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostgroupsAddComponent } from './hostgroups-add.component';

describe('HostgroupsAddComponent', () => {
  let component: HostgroupsAddComponent;
  let fixture: ComponentFixture<HostgroupsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostgroupsAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HostgroupsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
