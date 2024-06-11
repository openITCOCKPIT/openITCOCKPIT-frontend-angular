import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoststatusIconComponent } from './hoststatus-icon.component';

describe('HoststatusIconComponent', () => {
  let component: HoststatusIconComponent;
  let fixture: ComponentFixture<HoststatusIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoststatusIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HoststatusIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
