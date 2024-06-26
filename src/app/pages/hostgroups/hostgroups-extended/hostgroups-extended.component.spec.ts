import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostgroupsExtendedComponent } from './hostgroups-extended.component';

describe('HostgroupsExtendedComponent', () => {
  let component: HostgroupsExtendedComponent;
  let fixture: ComponentFixture<HostgroupsExtendedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostgroupsExtendedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostgroupsExtendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
