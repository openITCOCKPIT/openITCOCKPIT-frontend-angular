import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomapsCopyComponent } from './automaps-copy.component';

describe('AutomapsCopyComponent', () => {
  let component: AutomapsCopyComponent;
  let fixture: ComponentFixture<AutomapsCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomapsCopyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomapsCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
