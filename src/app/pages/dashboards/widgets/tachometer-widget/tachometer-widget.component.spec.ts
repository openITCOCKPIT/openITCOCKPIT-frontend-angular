import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TachometerWidgetComponent } from './tachometer-widget.component';

describe('TachometerWidgetComponent', () => {
  let component: TachometerWidgetComponent;
  let fixture: ComponentFixture<TachometerWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TachometerWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TachometerWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
