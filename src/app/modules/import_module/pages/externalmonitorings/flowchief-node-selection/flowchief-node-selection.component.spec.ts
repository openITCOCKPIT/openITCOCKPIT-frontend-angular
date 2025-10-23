import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowchiefNodeSelectionComponent } from './flowchief-node-selection.component';

describe('FlowchiefNodeSelectionComponent', () => {
  let component: FlowchiefNodeSelectionComponent;
  let fixture: ComponentFixture<FlowchiefNodeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowchiefNodeSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowchiefNodeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
