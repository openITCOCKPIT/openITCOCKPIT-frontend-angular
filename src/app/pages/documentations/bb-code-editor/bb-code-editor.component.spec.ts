import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbCodeEditorComponent } from './bb-code-editor.component';

describe('BbCodeEditorComponent', () => {
  let component: BbCodeEditorComponent;
  let fixture: ComponentFixture<BbCodeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BbCodeEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BbCodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
