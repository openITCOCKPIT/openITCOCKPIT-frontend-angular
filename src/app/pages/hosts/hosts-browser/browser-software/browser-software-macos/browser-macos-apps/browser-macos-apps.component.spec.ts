import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserMacosAppsComponent } from './browser-macos-apps.component';

describe('BrowserMacosAppsComponent', () => {
  let component: BrowserMacosAppsComponent;
  let fixture: ComponentFixture<BrowserMacosAppsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserMacosAppsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowserMacosAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
