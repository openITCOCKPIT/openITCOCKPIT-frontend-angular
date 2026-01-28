import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserWindowsAppsComponent } from './browser-windows-apps.component';

describe('BrowserWindowsAppsComponent', () => {
  let component: BrowserWindowsAppsComponent;
  let fixture: ComponentFixture<BrowserWindowsAppsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserWindowsAppsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowserWindowsAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
