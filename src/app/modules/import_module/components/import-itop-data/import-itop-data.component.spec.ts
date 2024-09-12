import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportITopDataComponent } from './import-itop-data.component';

describe('ImportITopDataComponent', () => {
  let component: ImportITopDataComponent;
  let fixture: ComponentFixture<ImportITopDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportITopDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportITopDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
