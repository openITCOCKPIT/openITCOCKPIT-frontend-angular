import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NagiostatsIndexComponent } from './nagiostats-index.component';

describe('NagiostatsIndexComponent', () => {
  let component: NagiostatsIndexComponent;
  let fixture: ComponentFixture<NagiostatsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NagiostatsIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NagiostatsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
