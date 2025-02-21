import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaWidgetComponent } from './sla-widget.component';

describe('SlaWidgetComponent', () => {
  let component: SlaWidgetComponent;
  let fixture: ComponentFixture<SlaWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlaWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlaWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
