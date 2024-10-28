import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MkagentsAddComponent } from './mkagents-add.component';

describe('MkagentsAddComponent', () => {
  let component: MkagentsAddComponent;
  let fixture: ComponentFixture<MkagentsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MkagentsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MkagentsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
