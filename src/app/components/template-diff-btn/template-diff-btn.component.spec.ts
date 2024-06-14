import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDiffBtnComponent } from './template-diff-btn.component';

describe('TemplateDiffBtnComponent', () => {
  let component: TemplateDiffBtnComponent;
  let fixture: ComponentFixture<TemplateDiffBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateDiffBtnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateDiffBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
