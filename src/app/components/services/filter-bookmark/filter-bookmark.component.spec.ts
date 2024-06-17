import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBookmarkComponent } from './filter-bookmark.component';

describe('FilterBookmarkComponent', () => {
  let component: FilterBookmarkComponent;
  let fixture: ComponentFixture<FilterBookmarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterBookmarkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterBookmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
