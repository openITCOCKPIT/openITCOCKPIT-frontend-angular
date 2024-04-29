import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelogsIndexComponent } from './changelogs-index.component';

describe('ChangelogsIndexComponent', () => {
  let component: ChangelogsIndexComponent;
  let fixture: ComponentFixture<ChangelogsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangelogsIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangelogsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
