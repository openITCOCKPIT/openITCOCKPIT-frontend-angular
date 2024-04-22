import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandsEditPageComponent } from './commands-edit-page.component';

describe('CommandsEditPageComponent', () => {
    let component: CommandsEditPageComponent;
    let fixture: ComponentFixture<CommandsEditPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommandsEditPageComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CommandsEditPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
