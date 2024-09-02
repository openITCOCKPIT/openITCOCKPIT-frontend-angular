import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdoitOverviewComponent } from './idoit-overview.component';

describe('IdoitOverviewComponent', () => {
  let component: IdoitOverviewComponent;
  let fixture: ComponentFixture<IdoitOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdoitOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdoitOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
