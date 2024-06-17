import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostescalationsIndexComponent } from './hostescalations-index.component';

describe('HostescalationsIndexComponent', () => {
  let component: HostescalationsIndexComponent;
  let fixture: ComponentFixture<HostescalationsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostescalationsIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HostescalationsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
