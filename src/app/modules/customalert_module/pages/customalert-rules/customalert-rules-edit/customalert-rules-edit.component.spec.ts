import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomalertRulesEditComponent } from './customalert-rules-edit.component';

describe('CustomalertRulesEditComponent', () => {
  let component: CustomalertRulesEditComponent;
  let fixture: ComponentFixture<CustomalertRulesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomalertRulesEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomalertRulesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
