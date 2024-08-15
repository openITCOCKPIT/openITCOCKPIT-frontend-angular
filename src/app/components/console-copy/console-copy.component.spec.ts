import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleCopyComponent } from './console-copy.component';

describe('ConsoleCopyComponent', () => {
  let component: ConsoleCopyComponent;
  let fixture: ComponentFixture<ConsoleCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsoleCopyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsoleCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
