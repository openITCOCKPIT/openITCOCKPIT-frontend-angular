import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoreportBitwiseIconComponent } from './autoreport-bitwise-icon.component';

describe('AutoreportBitwiseIconComponent', () => {
  let component: AutoreportBitwiseIconComponent;
  let fixture: ComponentFixture<AutoreportBitwiseIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoreportBitwiseIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoreportBitwiseIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
