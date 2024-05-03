import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsIndexComponent } from './statistics-index.component';

describe('StatisticsIndexComponent', () => {
  let component: StatisticsIndexComponent;
  let fixture: ComponentFixture<StatisticsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticsIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatisticsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
