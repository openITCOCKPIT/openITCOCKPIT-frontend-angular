import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedHostgroupsViewComponent } from './imported-hostgroups-view.component';

describe('ImportedHostgroupsViewComponent', () => {
  let component: ImportedHostgroupsViewComponent;
  let fixture: ComponentFixture<ImportedHostgroupsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportedHostgroupsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportedHostgroupsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
