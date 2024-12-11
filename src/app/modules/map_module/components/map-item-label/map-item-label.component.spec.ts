import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapItemLabelComponent } from './map-item-label.component';

describe('MapItemLabelComponent', () => {
  let component: MapItemLabelComponent;
  let fixture: ComponentFixture<MapItemLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapItemLabelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapItemLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
