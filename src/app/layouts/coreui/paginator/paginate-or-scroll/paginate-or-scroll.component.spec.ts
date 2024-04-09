import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginateOrScrollComponent } from './paginate-or-scroll.component';

describe('PaginateOrScrollComponent', () => {
  let component: PaginateOrScrollComponent;
  let fixture: ComponentFixture<PaginateOrScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginateOrScrollComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaginateOrScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
