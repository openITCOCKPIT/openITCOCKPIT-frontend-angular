import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandsCopyComponent } from './commands-copy.component';

describe('CommandsCopyComponent', () => {
  let component: CommandsCopyComponent;
  let fixture: ComponentFixture<CommandsCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandsCopyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommandsCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
