import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsergroupsCopyComponent } from './usergroups-copy.component';

describe('UsergroupsCopyComponent', () => {
  let component: UsergroupsCopyComponent;
  let fixture: ComponentFixture<UsergroupsCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsergroupsCopyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsergroupsCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
