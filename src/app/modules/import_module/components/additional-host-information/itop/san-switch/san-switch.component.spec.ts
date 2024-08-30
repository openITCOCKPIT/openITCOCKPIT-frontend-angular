import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanSwitchComponent } from './san-switch.component';

describe('SanSwitchComponent', () => {
  let component: SanSwitchComponent;
  let fixture: ComponentFixture<SanSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SanSwitchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
