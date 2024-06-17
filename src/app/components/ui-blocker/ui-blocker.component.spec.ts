import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBlockerComponent } from './ui-blocker.component';

describe('UiBlockerComponent', () => {
  let component: UiBlockerComponent;
  let fixture: ComponentFixture<UiBlockerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBlockerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UiBlockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
