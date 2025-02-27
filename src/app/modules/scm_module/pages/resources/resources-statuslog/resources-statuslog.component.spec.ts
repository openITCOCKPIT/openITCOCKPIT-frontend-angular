import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesStatuslogComponent } from './resources-statuslog.component';

describe('ResourcesStatuslogComponent', () => {
  let component: ResourcesStatuslogComponent;
  let fixture: ComponentFixture<ResourcesStatuslogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesStatuslogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesStatuslogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
