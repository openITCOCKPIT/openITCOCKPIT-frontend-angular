import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafanaPanelComponent } from './grafana-panel.component';

describe('GrafanaPanelComponent', () => {
  let component: GrafanaPanelComponent;
  let fixture: ComponentFixture<GrafanaPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrafanaPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrafanaPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
