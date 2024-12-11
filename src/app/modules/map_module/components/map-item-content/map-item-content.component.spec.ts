import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapItemContentComponent } from './map-item-content.component';

describe('MapItemContentComponent', () => {
  let component: MapItemContentComponent;
  let fixture: ComponentFixture<MapItemContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapItemContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapItemContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
