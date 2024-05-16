import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HosttemplatesUsedByComponent } from './hosttemplates-used-by.component';

describe('HosttemplatesUsedByComponent', () => {
  let component: HosttemplatesUsedByComponent;
  let fixture: ComponentFixture<HosttemplatesUsedByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HosttemplatesUsedByComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HosttemplatesUsedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
