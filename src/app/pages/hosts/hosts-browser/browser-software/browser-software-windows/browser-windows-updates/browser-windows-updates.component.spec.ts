import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserWindowsUpdatesComponent } from './browser-windows-updates.component';

describe('BrowserWindowsUpdatesComponent', () => {
  let component: BrowserWindowsUpdatesComponent;
  let fixture: ComponentFixture<BrowserWindowsUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserWindowsUpdatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowserWindowsUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
