import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoreportHostUsedByComponent } from './autoreport-host-used-by.component';

describe('AutoreportHostUsedByComponent', () => {
  let component: AutoreportHostUsedByComponent;
  let fixture: ComponentFixture<AutoreportHostUsedByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoreportHostUsedByComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoreportHostUsedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
