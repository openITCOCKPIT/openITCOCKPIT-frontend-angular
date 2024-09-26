import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportChangelogsIndexComponent } from './import-changelogs-index.component';

describe('ImportChangelogsIndexComponent', () => {
  let component: ImportChangelogsIndexComponent;
  let fixture: ComponentFixture<ImportChangelogsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportChangelogsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportChangelogsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
