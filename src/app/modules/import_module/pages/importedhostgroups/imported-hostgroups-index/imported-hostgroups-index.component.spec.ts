import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedHostgroupsIndexComponent } from './imported-hostgroups-index.component';

describe('ImportedHostgroupsIndexComponent', () => {
  let component: ImportedHostgroupsIndexComponent;
  let fixture: ComponentFixture<ImportedHostgroupsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportedHostgroupsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportedHostgroupsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
