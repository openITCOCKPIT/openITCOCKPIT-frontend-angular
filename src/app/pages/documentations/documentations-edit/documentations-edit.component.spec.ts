import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationsEditComponent } from './documentations-edit.component';

describe('DocumentationsEditComponent', () => {
  let component: DocumentationsEditComponent;
  let fixture: ComponentFixture<DocumentationsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentationsEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentationsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
