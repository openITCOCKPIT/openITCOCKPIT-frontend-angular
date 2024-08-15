import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemHealthUsersIndexComponent } from './system-health-users-index.component';

describe('SystemHealthUsersIndexComponent', () => {
  let component: SystemHealthUsersIndexComponent;
  let fixture: ComponentFixture<SystemHealthUsersIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemHealthUsersIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemHealthUsersIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
