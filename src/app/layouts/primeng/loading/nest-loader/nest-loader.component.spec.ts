import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestLoaderComponent } from './nest-loader.component';

describe('NestLoaderComponent', () => {
  let component: NestLoaderComponent;
  let fixture: ComponentFixture<NestLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NestLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NestLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
