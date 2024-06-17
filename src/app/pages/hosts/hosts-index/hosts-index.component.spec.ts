import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsIndexComponent } from './hosts-index.component';

describe('HostsIndexComponent', () => {
  let component: HostsIndexComponent;
  let fixture: ComponentFixture<HostsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostsIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HostsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
