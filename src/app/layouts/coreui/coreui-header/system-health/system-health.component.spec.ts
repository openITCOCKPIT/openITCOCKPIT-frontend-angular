import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemHealthComponent } from './system-health.component';

describe('SystemHealthComponent', () => {
  let component: SystemHealthComponent;
  let fixture: ComponentFixture<SystemHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemHealthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
