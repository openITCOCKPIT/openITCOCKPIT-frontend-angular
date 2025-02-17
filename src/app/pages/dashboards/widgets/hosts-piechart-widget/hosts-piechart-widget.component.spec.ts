import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsPiechartWidgetComponent } from './hosts-piechart-widget.component';

describe('HostsPiechartWidgetComponent', () => {
  let component: HostsPiechartWidgetComponent;
  let fixture: ComponentFixture<HostsPiechartWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostsPiechartWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostsPiechartWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
