import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatehistoriesServiceComponent } from './statehistories-service.component';

describe('StatehistoriesServiceComponent', () => {
  let component: StatehistoriesServiceComponent;
  let fixture: ComponentFixture<StatehistoriesServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatehistoriesServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatehistoriesServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
