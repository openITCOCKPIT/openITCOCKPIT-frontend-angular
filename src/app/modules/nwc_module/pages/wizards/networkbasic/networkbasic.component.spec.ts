import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkbasicComponent } from './networkbasic.component';

describe('NetworkbasicComponent', () => {
  let component: NetworkbasicComponent;
  let fixture: ComponentFixture<NetworkbasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkbasicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkbasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
