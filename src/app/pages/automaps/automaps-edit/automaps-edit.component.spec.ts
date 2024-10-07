import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomapsEditComponent } from './automaps-edit.component';

describe('AutomapsEditComponent', () => {
  let component: AutomapsEditComponent;
  let fixture: ComponentFixture<AutomapsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomapsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomapsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
