import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MkagentsListDownloadsComponent } from './mkagents-list-downloads.component';

describe('MkagentsListDownloadsComponent', () => {
  let component: MkagentsListDownloadsComponent;
  let fixture: ComponentFixture<MkagentsListDownloadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MkagentsListDownloadsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MkagentsListDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
