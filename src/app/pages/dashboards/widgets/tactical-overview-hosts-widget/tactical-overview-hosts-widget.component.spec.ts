import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacticalOverviewHostsWidgetComponent } from './tactical-overview-hosts-widget.component';

describe('TacticalOverviewHostsWidgetComponent', () => {
  let component: TacticalOverviewHostsWidgetComponent;
  let fixture: ComponentFixture<TacticalOverviewHostsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TacticalOverviewHostsWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TacticalOverviewHostsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
