import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterComponent } from './printer.component';

describe('PrinterComponent', () => {
  let component: PrinterComponent;
  let fixture: ComponentFixture<PrinterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrinterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
