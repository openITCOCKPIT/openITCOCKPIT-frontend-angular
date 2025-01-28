import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenstreetmapToasterComponent } from './openstreetmap-toaster.component';

describe('OpenstreetmapToasterComponent', () => {
  let component: OpenstreetmapToasterComponent;
  let fixture: ComponentFixture<OpenstreetmapToasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenstreetmapToasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenstreetmapToasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
