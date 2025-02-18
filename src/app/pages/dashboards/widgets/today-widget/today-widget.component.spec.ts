import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayWidgetComponent } from './today-widget.component';

describe('TodayWidgetComponent', () => {
  let component: TodayWidgetComponent;
  let fixture: ComponentFixture<TodayWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
