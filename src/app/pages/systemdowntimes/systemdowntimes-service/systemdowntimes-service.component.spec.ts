import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemdowntimesServiceComponent } from './systemdowntimes-service.component';

describe('SystemdowntimesServiceComponent', () => {
  let component: SystemdowntimesServiceComponent;
  let fixture: ComponentFixture<SystemdowntimesServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemdowntimesServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemdowntimesServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
