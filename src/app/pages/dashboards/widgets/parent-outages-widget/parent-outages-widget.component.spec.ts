import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentOutagesWidgetComponent } from './parent-outages-widget.component';

describe('ParentOutagesWidgetComponent', () => {
  let component: ParentOutagesWidgetComponent;
  let fixture: ComponentFixture<ParentOutagesWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentOutagesWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentOutagesWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
