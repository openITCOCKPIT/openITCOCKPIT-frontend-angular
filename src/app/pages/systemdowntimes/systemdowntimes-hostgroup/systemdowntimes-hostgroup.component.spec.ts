import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemdowntimesHostgroupComponent } from './systemdowntimes-hostgroup.component';

describe('SystemdowntimesHostgroupComponent', () => {
  let component: SystemdowntimesHostgroupComponent;
  let fixture: ComponentFixture<SystemdowntimesHostgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemdowntimesHostgroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemdowntimesHostgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
