import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserMacosUpdatesComponent } from './browser-macos-updates.component';

describe('BrowserMacosUpdatesComponent', () => {
  let component: BrowserMacosUpdatesComponent;
  let fixture: ComponentFixture<BrowserMacosUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserMacosUpdatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowserMacosUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
