import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserSoftwareWindowsComponent } from './browser-software-windows.component';

describe('BrowserSoftwareWindowsComponent', () => {
  let component: BrowserSoftwareWindowsComponent;
  let fixture: ComponentFixture<BrowserSoftwareWindowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserSoftwareWindowsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowserSoftwareWindowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
