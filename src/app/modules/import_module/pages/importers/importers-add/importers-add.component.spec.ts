import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportersAddComponent } from './importers-add.component';

describe('ImportersAddComponent', () => {
  let component: ImportersAddComponent;
  let fixture: ComponentFixture<ImportersAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportersAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportersAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
