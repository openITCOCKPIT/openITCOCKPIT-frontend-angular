import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerLinkComponent } from './server-link.component';

describe('ServerLinkComponent', () => {
  let component: ServerLinkComponent;
  let fixture: ComponentFixture<ServerLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
