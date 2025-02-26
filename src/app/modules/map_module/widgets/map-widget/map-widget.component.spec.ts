import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapWidgetComponent } from './map-widget.component';

describe('MapWidgetComponent', () => {
  let component: MapWidgetComponent;
  let fixture: ComponentFixture<MapWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
