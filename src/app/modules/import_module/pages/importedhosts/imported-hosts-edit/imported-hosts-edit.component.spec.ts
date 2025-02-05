import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedHostsEditComponent } from './imported-hosts-edit.component';

describe('ImportedHostsEditComponent', () => {
  let component: ImportedHostsEditComponent;
  let fixture: ComponentFixture<ImportedHostsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportedHostsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportedHostsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
