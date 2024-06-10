import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsDeletedComponent } from './hosts-deleted.component';

describe('HostsDeletedComponent', () => {
  let component: HostsDeletedComponent;
  let fixture: ComponentFixture<HostsDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostsDeletedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HostsDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
