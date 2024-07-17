import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsBrowserComponent } from './hosts-browser.component';

describe('HostsBrowserComponent', () => {
  let component: HostsBrowserComponent;
  let fixture: ComponentFixture<HostsBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostsBrowserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostsBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
