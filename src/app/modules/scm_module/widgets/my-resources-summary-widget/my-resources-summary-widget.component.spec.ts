import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyResourcesSummaryWidgetComponent } from './my-resources-summary-widget.component';

describe('MyResourcesSummaryWidgetComponent', () => {
  let component: MyResourcesSummaryWidgetComponent;
  let fixture: ComponentFixture<MyResourcesSummaryWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyResourcesSummaryWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyResourcesSummaryWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
