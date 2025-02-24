import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoreportGenerateComponent } from './autoreport-generate.component';

describe('AutoreportGenerateComponent', () => {
  let component: AutoreportGenerateComponent;
  let fixture: ComponentFixture<AutoreportGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoreportGenerateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoreportGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
