import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UplotGraphComponent } from './uplot-graph.component';

describe('UplotGraphComponent', () => {
  let component: UplotGraphComponent;
  let fixture: ComponentFixture<UplotGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UplotGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UplotGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
