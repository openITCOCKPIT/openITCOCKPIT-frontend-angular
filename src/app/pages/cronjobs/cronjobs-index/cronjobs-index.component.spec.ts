import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronjobsIndexComponent } from './cronjobs-index.component';

describe('CronjobsIndexComponent', () => {
  let component: CronjobsIndexComponent;
  let fixture: ComponentFixture<CronjobsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CronjobsIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CronjobsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
