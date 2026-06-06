import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserSoftwareLinuxComponent } from './browser-software-linux.component';

describe('BrowserSoftwareLinuxComponent', () => {
  let component: BrowserSoftwareLinuxComponent;
  let fixture: ComponentFixture<BrowserSoftwareLinuxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserSoftwareLinuxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowserSoftwareLinuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
