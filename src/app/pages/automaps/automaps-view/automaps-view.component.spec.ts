import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomapsViewComponent } from './automaps-view.component';

describe('AutomapsViewComponent', () => {
  let component: AutomapsViewComponent;
  let fixture: ComponentFixture<AutomapsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomapsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomapsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
