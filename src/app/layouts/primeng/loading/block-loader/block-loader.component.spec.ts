import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockLoaderComponent } from './block-loader.component';

describe('BlockLoaderComponent', () => {
  let component: BlockLoaderComponent;
  let fixture: ComponentFixture<BlockLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
