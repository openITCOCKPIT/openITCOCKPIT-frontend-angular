import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserSoftwareMacosComponent } from './browser-software-macos.component';

describe('BrowserSoftwareMacosComponent', () => {
  let component: BrowserSoftwareMacosComponent;
  let fixture: ComponentFixture<BrowserSoftwareMacosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserSoftwareMacosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowserSoftwareMacosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
