import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedFilesViewComponent } from './imported-files-view.component';

describe('ImportedFilesViewComponent', () => {
  let component: ImportedFilesViewComponent;
  let fixture: ComponentFixture<ImportedFilesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportedFilesViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportedFilesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
