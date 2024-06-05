import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostescalationsAddComponent } from './hostescalations-add.component';

describe('HostescalationsAddComponent', () => {
  let component: HostescalationsAddComponent;
  let fixture: ComponentFixture<HostescalationsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostescalationsAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HostescalationsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
