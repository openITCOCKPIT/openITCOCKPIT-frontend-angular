import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarSearchComponent } from './navbar-search.component';

describe('NavbarSearchComponent', () => {
  let component: NavbarSearchComponent;
  let fixture: ComponentFixture<NavbarSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
