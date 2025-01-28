import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedHostsIndexComponent } from './imported-hosts-index.component';

describe('ImportedHostsIndexComponent', () => {
  let component: ImportedHostsIndexComponent;
  let fixture: ComponentFixture<ImportedHostsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportedHostsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportedHostsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
