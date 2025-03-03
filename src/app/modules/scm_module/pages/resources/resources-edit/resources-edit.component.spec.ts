import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesEditComponent } from './resources-edit.component';

describe('ResourcesEditComponent', () => {
  let component: ResourcesEditComponent;
  let fixture: ComponentFixture<ResourcesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
