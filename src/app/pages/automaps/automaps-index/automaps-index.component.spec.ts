import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomapsIndexComponent } from './automaps-index.component';

describe('AutomapsIndexComponent', () => {
  let component: AutomapsIndexComponent;
  let fixture: ComponentFixture<AutomapsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomapsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomapsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
