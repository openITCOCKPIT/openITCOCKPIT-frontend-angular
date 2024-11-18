import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomalertRulesAddComponent } from './customalert-rules-add.component';

describe('CustomalertRulesAddComponent', () => {
  let component: CustomalertRulesAddComponent;
  let fixture: ComponentFixture<CustomalertRulesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomalertRulesAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomalertRulesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
