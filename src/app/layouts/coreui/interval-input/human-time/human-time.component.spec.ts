import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanTimeComponent } from './human-time.component';

describe('HumanTimeComponent', () => {
  let component: HumanTimeComponent;
  let fixture: ComponentFixture<HumanTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanTimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HumanTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
