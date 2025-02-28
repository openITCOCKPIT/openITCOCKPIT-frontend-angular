import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesSetStatusModalComponent } from './resources-set-status-modal.component';

describe('ResourcesSetStatusModalComponent', () => {
  let component: ResourcesSetStatusModalComponent;
  let fixture: ComponentFixture<ResourcesSetStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesSetStatusModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesSetStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
