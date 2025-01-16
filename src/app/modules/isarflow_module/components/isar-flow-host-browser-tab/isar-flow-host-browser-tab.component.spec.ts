import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsarFlowHostBrowserTabComponent } from './isar-flow-host-browser-tab.component';

describe('IsarFlowHostBrowserTabComponent', () => {
  let component: IsarFlowHostBrowserTabComponent;
  let fixture: ComponentFixture<IsarFlowHostBrowserTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsarFlowHostBrowserTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IsarFlowHostBrowserTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
