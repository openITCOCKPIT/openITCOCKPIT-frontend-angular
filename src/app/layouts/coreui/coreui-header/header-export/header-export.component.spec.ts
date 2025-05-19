import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderExportComponent } from './header-export.component';

describe('HeaderExportComponent', () => {
  let component: HeaderExportComponent;
  let fixture: ComponentFixture<HeaderExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
