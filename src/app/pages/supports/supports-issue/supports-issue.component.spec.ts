import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportsIssueComponent } from './supports-issue.component';

describe('SupportsIssueComponent', () => {
  let component: SupportsIssueComponent;
  let fixture: ComponentFixture<SupportsIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportsIssueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupportsIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
