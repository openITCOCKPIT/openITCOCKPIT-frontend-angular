import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContainerModalComponent } from './create-container-modal.component';

describe('CreateContainerModalComponent', () => {
  let component: CreateContainerModalComponent;
  let fixture: ComponentFixture<CreateContainerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateContainerModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateContainerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
